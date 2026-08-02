import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import { auxiliaresService, movimientosService } from '../services/api';

export function HistorialMovimientos() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [talleres, setTalleres] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [talles, setTalles] = useState<any[]>([]);

  const [filtroTaller, setFiltroTaller] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cargando, setCargando] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [movimientoEnEdicion, setMovimientoEnEdicion] = useState<any | null>(null);
  const [formEdicion, setFormEdicion] = useState({
    tipo_movimiento: 'INGRESO',
    id_taller: '',
    id_articulo: '',
    id_color: '',
    id_talle: '',
    cantidad: '',
    fecha: '',
    observacion: '',
  });

  useEffect(() => {
    cargarAuxiliares();
    cargarMovimientos();
  }, []);

  const cargarAuxiliares = async () => {
    try {
      const [t, a, c, tal] = await Promise.all([
        auxiliaresService.getTalleres(),
        auxiliaresService.getArticulos(),
        auxiliaresService.getColores(),
        auxiliaresService.getTalles(),
      ]);
      setTalleres(t.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setArticulos(a.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setColores(c.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setTalles(tal);
    } catch (err) {
      setError('Error al cargar los datos auxiliares.');
    }
  };

  const cargarMovimientos = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await movimientosService.getAll();
      // Más recientes primero
      const ordenados = [...data].sort((a: any, b: any) => b.id_movimiento - a.id_movimiento);
      setMovimientos(ordenados);
    } catch (err) {
      setError('Error al cargar el historial de movimientos.');
    } finally {
      setCargando(false);
    }
  };

  const movimientosFiltrados = movimientos.filter((m) => {
    if (filtroTaller && m.taller?.id_taller !== Number(filtroTaller)) return false;
    if (filtroTipo && m.tipo_movimiento !== filtroTipo) return false;
    return true;
  });

  const handleAbrirEdicion = (mov: any) => {
    setMovimientoEnEdicion(mov);
    setFormEdicion({
      tipo_movimiento: mov.tipo_movimiento,
      id_taller: String(mov.taller?.id_taller || ''),
      id_articulo: String(mov.articulo?.id_articulo || ''),
      id_color: String(mov.color?.id_color || ''),
      id_talle: String(mov.talle?.id_talle || ''),
      cantidad: String(mov.cantidad),
      fecha: mov.fecha || '',
      observacion: mov.observacion || '',
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleGuardarEdicion = async () => {
    if (!movimientoEnEdicion) return;
    setError('');

    const cantidadNum = Number(formEdicion.cantidad);
    if (!cantidadNum || cantidadNum <= 0) {
      setError('La cantidad debe ser un número mayor a 0.');
      return;
    }
    if (!formEdicion.id_taller || !formEdicion.id_articulo || !formEdicion.id_color || !formEdicion.id_talle) {
      setError('Todos los campos (taller, artículo, color, talle) son obligatorios.');
      return;
    }

    try {
      await movimientosService.update(movimientoEnEdicion.id_movimiento, {
        tipo_movimiento: formEdicion.tipo_movimiento,
        id_taller: Number(formEdicion.id_taller),
        id_articulo: Number(formEdicion.id_articulo),
        id_color: Number(formEdicion.id_color),
        id_talle: Number(formEdicion.id_talle),
        cantidad: cantidadNum,
        fecha: formEdicion.fecha,
        observacion: formEdicion.observacion.trim() || null,
      });
      setShowModal(false);
      setSuccess(`Movimiento #${movimientoEnEdicion.id_movimiento} actualizado correctamente.`);
      cargarMovimientos();
    } catch (err) {
      setError('Error al actualizar el movimiento en el servidor.');
    }
  };

  const handleBorrar = async (mov: any) => {
    const confirmado = window.confirm(
      `¿Seguro que querés borrar este movimiento?\n\n` +
      `${mov.tipo_movimiento} - ${mov.articulo?.nombre} - ${mov.color?.nombre} - Talle ${mov.talle?.nombre} - Cantidad ${mov.cantidad}\n\n` +
      `Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    try {
      setError('');
      await movimientosService.delete(mov.id_movimiento);
      setSuccess(`Movimiento #${mov.id_movimiento} borrado correctamente.`);
      cargarMovimientos();
    } catch (err) {
      setError('Error al borrar el movimiento en el servidor.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Historial de Movimientos</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={4} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Filtrar por Taller</Form.Label>
                <Form.Select value={filtroTaller} onChange={(e) => setFiltroTaller(e.target.value)}>
                  <option value="">Todos los talleres</option>
                  {talleres.map((t) => (
                    <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Filtrar por Tipo</Form.Label>
                <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                  <option value="">Todos (Ingresos y Egresos)</option>
                  <option value="INGRESO">Solo Ingresos</option>
                  <option value="EGRESO">Solo Egresos</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-2 d-flex align-items-end">
              <Button variant="outline-dark" className="w-100" onClick={cargarMovimientos} disabled={cargando}>
                🔄 {cargando ? 'Actualizando...' : 'Refrescar lista'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase d-flex justify-content-between align-items-center">
          <span>Movimientos Registrados</span>
          <span className="badge bg-light text-dark fs-6">{movimientosFiltrados.length} resultados</span>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered hover responsive className="mb-0 text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th>Fecha</th>
                <th>Taller</th>
                <th>Tipo</th>
                <th>Artículo</th>
                <th>Color</th>
                <th>Talle</th>
                <th>Cantidad</th>
                <th>Observación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-muted py-4">No hay movimientos que coincidan con el filtro.</td>
                </tr>
              ) : (
                movimientosFiltrados.map((m) => (
                  <tr key={m.id_movimiento}>
                    <td>{m.fecha}</td>
                    <td className="text-uppercase">{m.taller?.nombre}</td>
                    <td>
                      <span className={`badge ${m.tipo_movimiento === 'INGRESO' ? 'bg-success' : 'bg-danger'}`}>
                        {m.tipo_movimiento}
                      </span>
                    </td>
                    <td className="fw-bold text-uppercase text-start ps-3">{m.articulo?.nombre}</td>
                    <td className="text-uppercase">{m.color?.nombre}</td>
                    <td>{m.talle?.nombre}</td>
                    <td className="fw-bold">{m.cantidad}</td>
                    <td className="text-muted fst-italic">{m.observacion || '—'}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button variant="warning" size="sm" onClick={() => handleAbrirEdicion(m)}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleBorrar(m)}>Borrar</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MODAL DE EDICIÓN */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header className="bg-dark text-white" closeButton>
          <Modal.Title className="fs-5 fw-bold text-uppercase">
            Editar Movimiento #{movimientoEnEdicion?.id_movimiento}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Tipo de Movimiento</Form.Label>
                <Form.Select
                  value={formEdicion.tipo_movimiento}
                  onChange={(e) => setFormEdicion({ ...formEdicion, tipo_movimiento: e.target.value })}
                >
                  <option value="INGRESO">INGRESO</option>
                  <option value="EGRESO">EGRESO</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Taller</Form.Label>
                <Form.Select
                  value={formEdicion.id_taller}
                  onChange={(e) => setFormEdicion({ ...formEdicion, id_taller: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {talleres.map((t) => (
                    <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Artículo</Form.Label>
                <Form.Select
                  value={formEdicion.id_articulo}
                  onChange={(e) => setFormEdicion({ ...formEdicion, id_articulo: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {articulos.map((a) => (
                    <option key={a.id_articulo} value={a.id_articulo}>{a.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Color</Form.Label>
                <Form.Select
                  value={formEdicion.id_color}
                  onChange={(e) => setFormEdicion({ ...formEdicion, id_color: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {colores.map((c) => (
                    <option key={c.id_color} value={c.id_color}>{c.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Talle</Form.Label>
                <Form.Select
                  value={formEdicion.id_talle}
                  onChange={(e) => setFormEdicion({ ...formEdicion, id_talle: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {talles.map((t) => (
                    <option key={t.id_talle} value={t.id_talle}>{t.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formEdicion.cantidad}
                  onChange={(e) => setFormEdicion({ ...formEdicion, cantidad: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={formEdicion.fecha}
                  onChange={(e) => setFormEdicion({ ...formEdicion, fecha: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Observación</Form.Label>
                <Form.Control
                  type="text"
                  value={formEdicion.observacion}
                  onChange={(e) => setFormEdicion({ ...formEdicion, observacion: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" className="fw-bold" onClick={handleGuardarEdicion}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
