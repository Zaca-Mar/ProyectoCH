import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import { auxiliaresService, movimientosService } from '../services/api';

export function EgresosTaller() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [idTaller, setIdTaller] = useState('');
  const [pendientesAgrupados, setPendientesAgrupados] = useState<any[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<any | null>(null);
  
  // Guardará los retiros ingresados en el modal por cada ID de talle: { [id_talle]: cantidad }
  const [cantidadesRetiro, setCantidadesRetiro] = useState<{ [key: string]: string }>({});
  const [observacion, setObservacion] = useState('');
  const [fechaEgreso, setFechaEgreso] = useState(new Date().toISOString().split('T')[0]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    auxiliaresService.getTalleres().then(data => {
      setTalleres(data.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));
    });
  }, []);

  useEffect(() => {
    if (idTaller) {
      cargarStockPendiente(Number(idTaller));
    } else {
      setPendientesAgrupados([]);
    }
  }, [idTaller]);

  const cargarStockPendiente = async (tallerId: number) => {
    try {
      setError('');
      const todosLosMovimientos = await movimientosService.getAll();
      const movimientosDelTaller = todosLosMovimientos.filter((m: any) => m.taller?.id_taller === tallerId);

      // Mapa indexado por: id_articulo-id_color
      const mapa: { [key: string]: {
        id_articulo: number;
        nombre_articulo: string;
        id_color: number;
        nombre_color: string;
        curva: { [id_talle: string]: { nombre: string; pendiente: number } };
      }} = {};

      movimientosDelTaller.forEach((m: any) => {
        const idArt = m.articulo?.id_articulo;
        const idCol = m.color?.id_color;
        const idTal = m.talle?.id_talle;
        if (!idArt || !idCol || !idTal) return;

        const clave = `${idArt}-${idCol}`;
        if (!mapa[clave]) {
          mapa[clave] = {
            id_articulo: idArt,
            nombre_articulo: m.articulo.nombre,
            id_color: idCol,
            nombre_color: m.color.nombre,
            curva: {}
          };
        }

        if (!mapa[clave].curva[idTal]) {
          mapa[clave].curva[idTal] = { nombre: m.talle.nombre, pendiente: 0 };
        }

        const cantidad = Number(m.cantidad || 0);
        if (m.tipo_movimiento === 'INGRESO') {
          mapa[clave].curva[idTal].pendiente += cantidad;
        } else if (m.tipo_movimiento === 'EGRESO') {
          mapa[clave].curva[idTal].pendiente -= cantidad;
        }
      });

      // Filtrar únicamente los modelos que retengan deuda real en algún talle
      const listaFinal: any[] = [];
      Object.values(mapa).forEach(item => {
        const curvaConDeuda: any = {};
        let tieneDeuda = false;

        Object.entries(item.curva).forEach(([idTal, data]: any) => {
          if (data.pendiente > 0) {
            curvaConDeuda[idTal] = data;
            tieneDeuda = true;
          }
        });

        if (tieneDeuda) {
          listaFinal.push({ ...item, curva: curvaConDeuda });
        }
      });

      setPendientesAgrupados(listaFinal.sort((a, b) => a.nombre_articulo.localeCompare(b.nombre_articulo)));
    } catch (err) {
      setError('Error al calcular las prendas agrupadas del taller.');
    }
  };

  const handleAbrirRetiro = (modelo: any) => {
    setModeloSeleccionado(modelo);
    setCantidadesRetiro({});
    setObservacion('');
    setFechaEgreso(new Date().toISOString().split('T')[0]); 
    setSuccess(false);
    setError('');
    setShowModal(true);
  };

  const handleCantidadModalChange = (idTalle: string, valor: string) => {
    setCantidadesRetiro(prev => ({ ...prev, [idTalle]: valor }));
  };

  const handleGuardarRetiroMasivo = async () => {
    setError('');
    
    const retirosValidos = Object.entries(cantidadesRetiro)
      .map(([idTalle, cant]) => ({ idTalle: Number(idTalle), cantidad: Number(cant) }))
      .filter(r => !isNaN(r.cantidad) && r.cantidad > 0);

    if (retirosValidos.length === 0) {
      setError('Por favor, ingresa una cantidad válida en al menos un talle.');
      return;
    }

    // Validar topes máximos de deuda por talle
    for (const r of retirosValidos) {
      const talleDeuda = modeloSeleccionado.curva[r.idTalle]?.pendiente || 0;
      if (r.cantidad > talleDeuda) {
        setError(`No puedes retirar más de lo debido en el talle ${modeloSeleccionado.curva[r.idTalle].nombre}.`);
        return;
      }
    }

    try {
      const solicitudes = retirosValidos.map(r => {
        return movimientosService.create({
          id_taller: Number(idTaller),
          tipo_movimiento: 'EGRESO',
          id_articulo: modeloSeleccionado.id_articulo,
          id_color: modeloSeleccionado.id_color,
          id_talle: r.idTalle,
          cantidad: r.cantidad,
          observacion: observacion.trim(),
          fecha: fechaEgreso
        } as any);
      });

      await Promise.all(solicitudes);
      setSuccess(true);
      setShowModal(false);
      cargarStockPendiente(Number(idTaller));
    } catch (err) {
      setError('Error al procesar el lote de egresos en el servidor.');
    }
  };

  // 🧮 TOTAL PENDIENTE POR ARTÍCULO Y TOTAL GENERAL DEL TALLER
  const totalPendientePorArticulo = (curva: { [id_talle: string]: { nombre: string; pendiente: number } }) =>
    Object.values(curva).reduce((acc, t) => acc + t.pendiente, 0);

  const totalPendienteGeneral = pendientesAgrupados.reduce(
    (acc, item) => acc + totalPendientePorArticulo(item.curva),
    0
  );

  // 🧮 TOTAL QUE SE ESTÁ RETIRANDO AHORA EN EL MODAL
  const totalRetiroModal = Object.values(cantidadesRetiro).reduce(
    (acc, v) => acc + (Number(v) || 0),
    0
  );

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Egresos de Taller</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Egresos registrados y saldos actualizados!</Alert>}

      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm border-dark">
            <Card.Body>
              <Form.Group>
                <Form.Label className="fw-bold text-uppercase">Seleccionar Taller</Form.Label>
                <Form.Select value={idTaller} onChange={(e) => setIdTaller(e.target.value)}>
                  <option value="">Selecciona el taller para ver qué debe...</option>
                  {talleres.map(t => <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>)}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {idTaller && (
        <Row>
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white fw-bold text-uppercase d-flex justify-content-between align-items-center">
                <span>Mercadería Pendiente de Entrega</span>
                <span className="badge bg-warning text-dark fs-6">Total pendiente: {totalPendienteGeneral}</span>
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>Artículo / Prenda</th>
                      <th>Color</th>
                      <th>En Taller </th>
                      <th>Total</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendientesAgrupados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-muted py-4 fs-6">🎉 ¡Al día! Sin deudas pendientes.</td>
                      </tr>
                    ) : (
                      pendientesAgrupados.map((item, index) => (
                        <tr key={index}>
                          <td className="fw-bold text-uppercase text-start ps-4">{item.nombre_articulo}</td>
                          <td className="text-uppercase">{item.nombre_color}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                              {Object.values(item.curva).map((tData: any, i) => (
                                <span key={i} className="badge bg-light text-dark border border-secondary p-2 fs-6">
                                  <strong className="bg-dark text-white px-1.5 py-0.5 rounded me-1">{tData.nombre}</strong>
                                  <span className="text-danger fw-bold">({tData.pendiente})</span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger p-2 fs-6">{totalPendientePorArticulo(item.curva)}</span>
                          </td>
                          <td>
                            <Button variant="outline-success" size="sm" className="fw-bold" onClick={() => handleAbrirRetiro(item)}>⬇️ Registrar Entrega</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {pendientesAgrupados.length > 0 && (
                    <tfoot>
                      <tr className="table-dark">
                        <td colSpan={3} className="text-end fw-bold text-uppercase pe-3">Total general pendiente</td>
                        <td className="fw-bold fs-5">{totalPendienteGeneral}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* MODAL MULTI-INPUT POR CURVA */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header className="bg-dark text-white" closeButton>
          <Modal.Title className="fs-5 fw-bold text-uppercase">Registrar Retiro de Prendas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modeloSeleccionado && (
            <div>
              <h5>Prenda: <span className="text-uppercase fw-bold text-primary">{modeloSeleccionado.nombre_articulo}</span> | Color: <span className="text-uppercase fw-bold text-primary">{modeloSeleccionado.nombre_color}</span></h5>
              <hr />
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Fecha de Egreso / Retiro</Form.Label>
                    <Form.Control type="date" value={fechaEgreso} onChange={(e) => setFechaEgreso(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Nota / Observación</Form.Label>
                    <Form.Control type="text" value={observacion} onChange={(e) => setObservacion(e.target.value)} placeholder="Ej: Chofer Juan" />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-bold text-uppercase text-muted mb-0">Cantidades a descargar por talle:</Form.Label>
                <span className="badge bg-success fs-6">Total a retirar: {totalRetiroModal}</span>
              </div>
              <Row className="g-2">
                {Object.entries(modeloSeleccionado.curva).map(([idTalle, tData]: any) => (
                  <Col sm={4} md={3} key={idTalle}>
                    <Card className="p-2 text-center bg-light">
                      <Form.Label className="fw-bold mb-1">Talle {tData.nombre} <span className="text-muted text-danger">({tData.pendiente})</span></Form.Label>
                      <Form.Control type="number" min="0" max={tData.pendiente} placeholder="0" className="text-center fw-bold" value={cantidadesRetiro[idTalle] || ''} onChange={(e) => handleCantidadModalChange(idTalle, e.target.value)} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" className="fw-bold" onClick={handleGuardarRetiroMasivo}>Confirmar Salida</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
