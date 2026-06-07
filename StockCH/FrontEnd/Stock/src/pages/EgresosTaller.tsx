import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import { auxiliaresService, movimientosService } from '../services/api';

interface PrendaPendiente {
  id_articulo: number;
  nombre_articulo: string;
  id_talle: number;
  nombre_talle: string;
  id_color: number;
  nombre_color: string;
  pendiente: number;
}

export function EgresosTaller() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [idTaller, setIdTaller] = useState('');
  const [pendientes, setPendientes] = useState<PrendaPendiente[]>([]);
  
  // Estado para el modal de descarga
  const [showModal, setShowModal] = useState(false);
  const [prendaSeleccionada, setPrendaSeleccionada] = useState<PrendaPendiente | null>(null);
  const [cantidadRetiro, setCantidadRetiro] = useState('');
  const [observacion, setObservacion] = useState('');
  
  // ➕ NUEVO: Estado para manejar la fecha específica de este egreso/retiro parcial
  const [fechaEgreso, setFechaEgreso] = useState(new Date().toISOString().split('T')[0]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    auxiliaresService.getTalleres().then(data => {
      setTalleres(data.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));
    });
  }, []);

  // Cada vez que cambia el taller, calculamos su stock pendiente
  useEffect(() => {
    if (idTaller) {
      cargarStockPendiente(Number(idTaller));
    } else {
      setPendientes([]);
    }
  }, [idTaller]);

  const cargarStockPendiente = async (tallerId: number) => {
    try {
      setError('');
      const todosLosMovimientos = await movimientosService.getAll();
      const movimientosDelTaller = todosLosMovimientos.filter((m: any) => m.taller?.id_taller === tallerId);

      const mapaSaldos: { [key: string]: { info: any; ingresos: number; egresos: number } } = {};

      movimientosDelTaller.forEach((m: any) => {
        const clave = `${m.articulo?.id_articulo}-${m.talle?.id_talle}-${m.color?.id_color}`;
        
        if (!mapaSaldos[clave]) {
          mapaSaldos[clave] = {
            info: m,
            ingresos: 0,
            egresos: 0
          };
        }

        if (m.tipo_movimiento === 'INGRESO') {
          mapaSaldos[clave].ingresos += Number(m.cantidad || 0);
        } else if (m.tipo_movimiento === 'EGRESO') {
          mapaSaldos[clave].egresos += Number(m.cantidad || 0);
        }
      });

      const listaPendientes: PrendaPendiente[] = [];
      Object.keys(mapaSaldos).forEach(clave => {
        const item = mapaSaldos[clave];
        const saldoPendiente = item.ingresos - item.egresos;

        if (saldoPendiente > 0) {
          listaPendientes.push({
            id_articulo: item.info.articulo?.id_articulo,
            nombre_articulo: item.info.articulo?.nombre || 'Desconocido',
            id_talle: item.info.talle?.id_talle,
            nombre_talle: item.info.talle?.nombre || 'N/A',
            id_color: item.info.color?.id_color,
            nombre_color: item.info.color?.nombre || 'N/A',
            pendiente: saldoPendiente
          });
        }
      });

      setPendientes(listaPendientes.sort((a, b) => a.nombre_articulo.localeCompare(b.nombre_articulo)));
    } catch (err) {
      setError('Error al calcular las prendas pendientes del taller.');
    }
  };

  const handleAbrirRetiro = (prenda: PrendaPendiente) => {
    setPrendaSeleccionada(prenda);
    setCantidadRetiro('');
    setObservacion('');
    // ➕ Reseteamos la fecha al día de hoy cada vez que se abre un artículo distinto
    setFechaEgreso(new Date().toISOString().split('T')[0]); 
    setSuccess(false);
    setError('');
    setShowModal(true);
  };

  const handleGuardarRetiro = async () => {
    if (!prendaSeleccionada || !cantidadRetiro || Number(cantidadRetiro) <= 0) {
      setError('Por favor, ingresa una cantidad válida de retiro.');
      return;
    }

    if (Number(cantidadRetiro) > prendaSeleccionada.pendiente) {
      setError(`No puedes retirar más de lo que el taller debe (${prendaSeleccionada.pendiente} unidades).`);
      return;
    }

    if (!fechaEgreso) {
      setError('Por favor, selecciona una fecha válida para el egreso.');
      return;
    }

    try {
      // Registramos el egreso mandando la fecha seleccionada en el modal
      const nuevoMovimiento: any = {
        id_taller: Number(idTaller),
        tipo_movimiento: 'EGRESO',
        id_articulo: prendaSeleccionada.id_articulo,
        id_talle: prendaSeleccionada.id_talle,
        id_color: prendaSeleccionada.id_color,
        cantidad: Number(cantidadRetiro),
        id_estado: 1,
        observacion: observacion.trim() ? `Retiro controlado: ${observacion}` : 'Retiro parcial de taller',
        fecha: fechaEgreso // ➕ Enviamos la fecha específica de esta fila a NestJS
      };

      await movimientosService.create(nuevoMovimiento);

      setSuccess(true);
      setShowModal(false);
      cargarStockPendiente(Number(idTaller)); // Recalcula la deuda automáticamente
    } catch (err) {
      setError('Error al procesar la salida de mercadería en el servidor.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Egresos Controlados (Descarga de Taller)</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Egreso registrado y saldo actualizado con éxito!</Alert>}

      {/* Selector de Taller */}
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm border-dark">
            <Card.Body>
              <Form.Group>
                <Form.Label className="fw-bold text-uppercase">Seleccionar Taller a Auditar</Form.Label>
                <Form.Select value={idTaller} onChange={(e) => setIdTaller(e.target.value)}>
                  <option value="">Selecciona el taller para ver qué debe...</option>
                  {talleres.map(t => (
                    <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de Deuda Pendiente */}
      {idTaller && (
        <Row>
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white fw-bold text-uppercase">
                Mercadería Pendiente de Entrega en este Taller
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>Artículo / Prenda</th>
                      <th>Talle</th>
                      <th>Color</th>
                      <th>Cantidad en Taller (Deuda)</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendientes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-muted py-4 fs-6">
                          🎉 ¡Al día! Este taller no tiene mercadería pendiente de entrega.
                        </td>
                      </tr>
                    ) : (
                      pendientes.map((item, index) => (
                        <tr key={index}>
                          <td className="fw-bold text-uppercase text-start ps-4">{item.nombre_articulo}</td>
                          <td><span className="badge bg-dark px-2 py-1">{item.nombre_talle}</span></td>
                          <td className="text-uppercase">{item.nombre_color}</td>
                          <td className="fw-bold text-danger fs-5">{item.pendiente}</td>
                          <td>
                            <Button variant="outline-success" size="sm" className="fw-bold" onClick={() => handleAbrirRetiro(item)}>
                              ⬇️ Registrar Entrega
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* MODAL POPUP PARA DESCARGAR CANTIDADES Y FECHAS */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header className="bg-dark text-white" closeButton>
          <Modal.Title className="fs-5 fw-bold text-uppercase">Registrar Devolución de Prenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prendaSeleccionada && (
            <div className="mb-3">
              <p className="mb-1"><strong>Artículo:</strong> <span className="text-uppercase">{prendaSeleccionada.nombre_articulo}</span></p>
              <p className="mb-1"><strong>Variante:</strong> Talle {prendaSeleccionada.nombre_talle} | Color {prendaSeleccionada.nombre_color}</p>
              <p className="text-danger"><strong>Cantidad Máxima que deben:</strong> {prendaSeleccionada.pendiente} unidades.</p>
              <hr />
              
              {/* ➕ NUEVO: Campo para definir la fecha exacta en la que se retira este artículo */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Fecha de Egreso / Retiro</Form.Label>
                <Form.Control 
                  type="date" 
                  value={fechaEgreso} 
                  onChange={(e) => setFechaEgreso(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">¿Cuántas unidades te está entregando el taller hoy?</Form.Label>
                <Form.Control 
                  type="number" 
                  value={cantidadRetiro} 
                  onChange={(e) => setCantidadRetiro(e.target.value)}
                  placeholder={`Máximo ${prendaSeleccionada.pendiente}`}
                  max={prendaSeleccionada.pendiente}
                  min="1"
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-semibold">Nota u Observación (Opcional)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={observacion} 
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Ej: Entrega parcial de remeras terminadas"
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" className="fw-bold" onClick={handleGuardarRetiro}>Confirmar Egreso</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}