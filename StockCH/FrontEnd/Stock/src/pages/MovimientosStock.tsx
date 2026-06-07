import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService, movimientosService } from '../services/api';

interface DetalleArticulo {
  id_articulo: string;
  nombre_articulo: string;
  id_talle: string;
  nombre_talle: string;
  id_color: string;
  nombre_color: string;
  cantidad: number;
}

export function MovimientosStock() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [talles, setTalles] = useState<any[]>([]);

  const [idTaller, setIdTaller] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('INGRESO');
  const [observacion, setObservacion] = useState('');
  // ➕ Nuevo estado para manejar la fecha de ingreso (inicializa con el día de hoy)
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0]);

  const [itemActual, setItemActual] = useState({
    id_articulo: '',
    id_talle: '',
    id_color: '',
    cantidad: ''
  });

  const [listaDetalle, setListaDetalle] = useState<DetalleArticulo[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [t, a, c, tal] = await Promise.all([
        auxiliaresService.getTalleres(),
        auxiliaresService.getArticulos(),
        auxiliaresService.getColores(),
        auxiliaresService.getTalles()
      ]);
      
      setTalleres(t.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setArticulos(a.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setColores(c.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setTalles(tal.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
    } catch (err) {
      setError('Error al cargar los datos de los selectores.');
    }
  };

  const handleItemChange = (e: React.ChangeEvent<any>) => {
    setItemActual({
      ...itemActual,
      [e.target.name]: e.target.value
    });
  };

  const agregarArticuloALista = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idTaller) {
      setError('Primero debes seleccionar un Taller Destino para poder añadir artículos.');
      return;
    }

    if (!itemActual.id_articulo || !itemActual.id_talle || !itemActual.id_color || !itemActual.cantidad) {
      setError('Por favor, completa todos los campos del artículo antes de añadirlo.');
      return;
    }

    if (Number(itemActual.cantidad) <= 0) {
      setError('La cantidad debe ser mayor a cero.');
      return;
    }

    const artSelected = articulos.find(x => x.id_articulo === Number(itemActual.id_articulo));
    const talleSelected = talles.find(x => x.id_talle === Number(itemActual.id_talle));
    const colSelected = colores.find(x => x.id_color === Number(itemActual.id_color));

    const nuevoItem: DetalleArticulo = {
      id_articulo: itemActual.id_articulo,
      nombre_articulo: artSelected?.nombre || 'Articulo',
      id_talle: itemActual.id_talle,
      nombre_talle: talleSelected?.nombre || 'Talle',
      id_color: itemActual.id_color,
      nombre_color: colSelected?.nombre || 'Color',
      cantidad: Number(itemActual.cantidad)
    };

    setListaDetalle([...listaDetalle, nuevoItem]);
    
    setItemActual({
      id_articulo: '',
      id_talle: '',
      id_color: '',
      cantidad: ''
    });
  };

  const eliminarItemDeLista = (index: number) => {
    const nuevaLista = [...listaDetalle];
    nuevaLista.splice(index, 1);
    setListaDetalle(nuevaLista);
  };

  const guardarMovimientoFinal = async () => {
    setError('');
    setSuccess(false);

    if (!idTaller) {
      setError('Debes seleccionar un taller obligatorio para procesar el remito.');
      return;
    }

    if (!fechaIngreso) {
      setError('Debes seleccionar una fecha de ingreso válida.');
      return;
    }

    if (listaDetalle.length === 0) {
      setError('Debes añadir al menos un artículo a la lista para poder guardar.');
      return;
    }

    try {
      const idEstadoPorDefecto = 1; 

      const solicitudes = listaDetalle.map(item => {
        return movimientosService.create({
          id_taller: Number(idTaller),
          tipo_movimiento: tipoMovimiento,
          id_articulo: Number(item.id_articulo),
          id_talle: Number(item.id_talle),
          id_color: Number(item.id_color),
          cantidad: item.cantidad,
          id_estado: idEstadoPorDefecto,
          observacion: observacion.trim() || null,
          fecha: fechaIngreso // 
        } as any);
      });

      await Promise.all(solicitudes);

      setSuccess(true);
      setListaDetalle([]); 
      setObservacion('');
      setIdTaller(''); 
      setFechaIngreso(new Date().toISOString().split('T')[0]); // Resetea a la fecha actual
    } catch (err: any) {
      setError('Error al registrar el bloque de movimientos en el servidor.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Registrar Ingreso a Taller</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Remito de movimientos registrado con éxito total!</Alert>}

      {/* SECCIÓN 1: DATOS GENERALES DEL MOVIMIENTO */}
      <Card className="shadow-sm mb-4 border-dark">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase">
          1. Datos Generales del Remito
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Reducido a md={3} para alinear los 4 inputs perfectamente */}
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Tipo de Operación</Form.Label>
                <Form.Select 
                  value={tipoMovimiento} 
                  onChange={(e) => setTipoMovimiento(e.target.value)}
                  className="fw-bold text-uppercase"
                  disabled={listaDetalle.length > 0}
                >
                  <option value="INGRESO">🟢 INGRESO al TALLER</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Taller Destino</Form.Label>
                <Form.Select 
                  value={idTaller} 
                  onChange={(e) => setIdTaller(e.target.value)}
                  disabled={listaDetalle.length > 0}
                  required
                >
                  <option value="">Seleccionar un taller...</option>
                  {talleres.map(t => (
                    <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>
                  ))}
                </Form.Select>
                {listaDetalle.length > 0 && (
                  <Form.Text className="text-muted d-block mt-1" style={{ fontSize: '0.82rem' }}>
                    Taller fijo hasta vaciar la lista.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            {/* ➕ NUEVO: Selector de Fecha de Ingreso General */}
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Fecha de Ingreso</Form.Label>
                <Form.Control 
                  type="date"
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                  disabled={listaDetalle.length > 0}
                  required
                />
                {listaDetalle.length > 0 && (
                  <Form.Text className="text-muted d-block mt-1" style={{ fontSize: '0.82rem' }}>
                    Fecha fija hasta vaciar la lista.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Observaciones (Opcional)</Form.Label>
                <Form.Control 
                  type="text"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Ej: Corte número 24 - Remeras"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* SECCIÓN 2: CARGA DINÁMICA DE ARTÍCULOS */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-secondary text-white fw-bold text-uppercase">
          2. Añadir Artículos al Listado
        </Card.Header>
        <Card.Body>
          <Form onSubmit={agregarArticuloALista}>
            <Row className="align-items-end">
              <Col md={3} className="mb-2">
                <Form.Group>
                  <Form.Label className="fw-semibold">Artículo</Form.Label>
                  <Form.Select 
                    name="id_articulo" 
                    value={itemActual.id_articulo} 
                    onChange={handleItemChange}
                    required
                  >
                    <option value="">Seleccionar artículo...</option>
                    {articulos.map(a => (
                      <option key={a.id_articulo} value={a.id_articulo}>{a.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2} className="mb-2">
                <Form.Group>
                  <Form.Label className="fw-semibold">Talle</Form.Label>
                  <Form.Select 
                    name="id_talle" 
                    value={itemActual.id_talle} 
                    onChange={handleItemChange}
                    required
                  >
                    <option value="">Talle...</option>
                    {talles.map(t => (
                      <option key={t.id_talle} value={t.id_talle}>{t.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3} className="mb-2">
                <Form.Group>
                  <Form.Label className="fw-semibold">Color</Form.Label>
                  <Form.Select 
                    name="id_color" 
                    value={itemActual.id_color} 
                    onChange={handleItemChange}
                    required
                  >
                    <option value="">Color...</option>
                    {colores.map(c => (
                      <option key={c.id_color} value={c.id_color}>{c.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2} className="mb-2">
                <Form.Group>
                  <Form.Label className="fw-semibold">Cantidad</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="cantidad"
                    value={itemActual.cantidad} 
                    onChange={handleItemChange}
                    placeholder="Unidades"
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={2} className="mb-2">
                <Button variant="outline-dark" type="submit" className="w-100 fw-bold">
                  ＋ Agregar Articulo
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* SECCIÓN 3: TABLA DE REVISIÓN Y GUARDADO FINAL */}
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase d-flex justify-content-between align-items-center">
          <span>Artículos Listados para Procesar</span>
          <span className="badge bg-light text-dark fs-6">
            Filas: {listaDetalle.length}
          </span>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered hover responsive className="mb-0 text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th>Artículo / Prenda</th>
                <th>Talle</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {listaDetalle.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted py-4">
                    La lista está vacía. Selecciona los campos de arriba y presiona "Agregar Fila".
                  </td>
                </tr>
              ) : (
                listaDetalle.map((item, index) => (
                  <tr key={index}>
                    <td className="fw-bold text-uppercase text-start ps-4">{item.nombre_articulo}</td>
                    <td><span className="badge bg-secondary px-2 py-1">{item.nombre_talle}</span></td>
                    <td className="text-uppercase">{item.nombre_color}</td>
                    <td className="fw-bold text-dark fs-6">{item.cantidad}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => eliminarItemDeLista(index)}>
                        Borrar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
        {listaDetalle.length > 0 && (
          <Card.Footer className="bg-light p-3 text-end">
            <Button variant="success" size="lg" className="fw-bold px-5 py-2 shadow" onClick={guardarMovimientoFinal}>
              Registrar Movimiento Completo
            </Button>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
}