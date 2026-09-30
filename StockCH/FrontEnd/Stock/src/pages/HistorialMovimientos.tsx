import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal, Badge } from 'react-bootstrap';
import { auxiliaresService, movimientosService } from '../services/api';

interface ItemCurva {
  id_talle: number;
  nombre_talle: string;
  cantidad: number;
  id_movimiento: number;
}

interface GrupoMovimiento {
  key: string;
  lote_id: string | null;
  esLote: boolean;
  tipo_movimiento: string;
  id_taller: number;
  nombre_taller: string;
  id_articulo: number;
  nombre_articulo: string;
  id_color: number;
  nombre_color: string;
  fecha: string;
  observacion: string;
  curva: ItemCurva[];
  total: number;
  ids: number[];
}

export function HistorialMovimientos() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [talleres, setTalleres] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [talles, setTalles] = useState<any[]>([]);

  const [filtroTaller, setFiltroTaller] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroArticulo, setFiltroArticulo] = useState('');
  const [filtroColor, setFiltroColor] = useState('');
  const [filtroTalle, setFiltroTalle] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cargando, setCargando] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [grupoEnEdicion, setGrupoEnEdicion] = useState<GrupoMovimiento | null>(null);

  const [formComun, setFormComun] = useState({
    tipo_movimiento: 'INGRESO',
    id_taller: '',
    id_articulo: '',
    id_color: '',
    fecha: '',
    observacion: '',
  });
  const [cantidadesLote, setCantidadesLote] = useState<{ [id_talle: string]: string }>({});
  const [formSuelto, setFormSuelto] = useState({ id_talle: '', cantidad: '' });

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
      setMovimientos(data);
    } catch (err) {
      setError('Error al cargar el historial de movimientos.');
    } finally {
      setCargando(false);
    }
  };

  // 🧩 AGRUPACIÓN: por lote_id+artículo+color, o suelto por id_movimiento si no tiene lote_id
  const agruparMovimientos = (lista: any[]): GrupoMovimiento[] => {
    const mapa: { [key: string]: GrupoMovimiento } = {};

    lista.forEach((m) => {
      const key = m.lote_id
        ? `${m.lote_id}-${m.articulo?.id_articulo}-${m.color?.id_color}`
        : `single-${m.id_movimiento}`;

      if (!mapa[key]) {
        mapa[key] = {
          key,
          lote_id: m.lote_id || null,
          esLote: !!m.lote_id,
          tipo_movimiento: m.tipo_movimiento,
          id_taller: m.taller?.id_taller,
          nombre_taller: m.taller?.nombre,
          id_articulo: m.articulo?.id_articulo,
          nombre_articulo: m.articulo?.nombre,
          id_color: m.color?.id_color,
          nombre_color: m.color?.nombre,
          fecha: m.fecha,
          observacion: m.observacion,
          curva: [],
          total: 0,
          ids: [],
        };
      }

      mapa[key].curva.push({
        id_talle: m.talle?.id_talle,
        nombre_talle: m.talle?.nombre,
        cantidad: m.cantidad,
        id_movimiento: m.id_movimiento,
      });
      mapa[key].total += m.cantidad;
      mapa[key].ids.push(m.id_movimiento);
    });

    return Object.values(mapa).sort((a, b) => Math.max(...b.ids) - Math.max(...a.ids));
  };

  const grupos = agruparMovimientos(movimientos);

  const gruposFiltrados = grupos.filter((g) => {
    if (filtroTaller && g.id_taller !== Number(filtroTaller)) return false;
    if (filtroTipo && g.tipo_movimiento !== filtroTipo) return false;
    if (filtroArticulo && g.id_articulo !== Number(filtroArticulo)) return false;
    if (filtroColor && g.id_color !== Number(filtroColor)) return false;
    if (filtroTalle && !g.curva.some((c) => c.id_talle === Number(filtroTalle))) return false;
    if (filtroFechaDesde && g.fecha < filtroFechaDesde) return false;
    if (filtroFechaHasta && g.fecha > filtroFechaHasta) return false;
    return true;
  });

  const handleAbrirEdicion = (grupo: GrupoMovimiento) => {
    setGrupoEnEdicion(grupo);
    setFormComun({
      tipo_movimiento: grupo.tipo_movimiento,
      id_taller: String(grupo.id_taller || ''),
      id_articulo: String(grupo.id_articulo || ''),
      id_color: String(grupo.id_color || ''),
      fecha: grupo.fecha || '',
      observacion: grupo.observacion || '',
    });

    if (grupo.esLote) {
      const precargadas: { [key: string]: string } = {};
      grupo.curva.forEach((c) => {
        precargadas[c.id_talle] = String(c.cantidad);
      });
      setCantidadesLote(precargadas);
    } else {
      const unico = grupo.curva[0];
      setFormSuelto({ id_talle: String(unico.id_talle), cantidad: String(unico.cantidad) });
    }

    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleCantidadLoteChange = (idTalle: string, valor: string) => {
    setCantidadesLote((prev) => ({ ...prev, [idTalle]: valor }));
  };

  const handleGuardarEdicion = async () => {
    if (!grupoEnEdicion) return;
    setError('');

    if (!formComun.id_taller || !formComun.id_articulo || !formComun.id_color || !formComun.fecha) {
      setError('Taller, artículo, color y fecha son obligatorios.');
      return;
    }

    try {
      if (grupoEnEdicion.esLote && grupoEnEdicion.lote_id) {
        const items = Object.entries(cantidadesLote)
          .map(([id_talle, cant]) => ({ id_talle: Number(id_talle), cantidad: Number(cant) }))
          .filter((i) => !isNaN(i.cantidad) && i.cantidad > 0);

        if (items.length === 0) {
          setError('Debes dejar al menos una cantidad mayor a cero en algún talle.');
          return;
        }

        await movimientosService.updateLote(
          grupoEnEdicion.lote_id,
          grupoEnEdicion.id_articulo,
          grupoEnEdicion.id_color,
          {
            id_taller: Number(formComun.id_taller),
            tipo_movimiento: formComun.tipo_movimiento,
            id_articulo: Number(formComun.id_articulo),
            id_color: Number(formComun.id_color),
            fecha: formComun.fecha,
            observacion: formComun.observacion.trim() || null,
            items,
          }
        );
        setSuccess('Lote actualizado correctamente.');
      } else {
        const cantidadNum = Number(formSuelto.cantidad);
        if (!formSuelto.id_talle || !cantidadNum || cantidadNum <= 0) {
          setError('Seleccioná un talle y una cantidad mayor a 0.');
          return;
        }

        const idMovimiento = grupoEnEdicion.ids[0];
        await movimientosService.update(idMovimiento, {
          tipo_movimiento: formComun.tipo_movimiento,
          id_taller: Number(formComun.id_taller),
          id_articulo: Number(formComun.id_articulo),
          id_color: Number(formComun.id_color),
          id_talle: Number(formSuelto.id_talle),
          cantidad: cantidadNum,
          fecha: formComun.fecha,
          observacion: formComun.observacion.trim() || null,
        });
        setSuccess(`Movimiento #${idMovimiento} actualizado correctamente.`);
      }

      setShowModal(false);
      cargarMovimientos();
    } catch (err) {
      setError('Error al actualizar en el servidor.');
    }
  };

  const handleBorrar = async (grupo: GrupoMovimiento) => {
    const detalleTalles = grupo.curva.map((c) => `${c.nombre_talle}: ${c.cantidad}`).join(', ');
    const confirmado = window.confirm(
      `¿Seguro que querés borrar ${grupo.esLote ? 'todo este lote' : 'este movimiento'}?\n\n` +
      `${grupo.tipo_movimiento} - ${grupo.nombre_articulo} - ${grupo.nombre_color}\n` +
      `Talles: ${detalleTalles}\n\n` +
      `Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    try {
      setError('');
      if (grupo.esLote && grupo.lote_id) {
        await movimientosService.deleteLote(grupo.lote_id, grupo.id_articulo, grupo.id_color);
        setSuccess('Lote borrado correctamente.');
      } else {
        await movimientosService.delete(grupo.ids[0]);
        setSuccess(`Movimiento #${grupo.ids[0]} borrado correctamente.`);
      }
      cargarMovimientos();
    } catch (err) {
      setError('Error al borrar en el servidor.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Historial de Movimientos</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-2">
            <Col md={3} className="mb-2">
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
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Filtrar por Tipo</Form.Label>
                <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                  <option value="">Todos (Ingresos y Egresos)</option>
                  <option value="INGRESO">Solo Ingresos</option>
                  <option value="EGRESO">Solo Egresos</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Filtrar por Artículo</Form.Label>
                <Form.Select value={filtroArticulo} onChange={(e) => setFiltroArticulo(e.target.value)}>
                  <option value="">Todos los artículos</option>
                  {articulos.map((a) => (
                    <option key={a.id_articulo} value={a.id_articulo}>{a.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Filtrar por Color</Form.Label>
                <Form.Select value={filtroColor} onChange={(e) => setFiltroColor(e.target.value)}>
                  <option value="">Todos los colores</option>
                  {colores.map((c) => (
                    <option key={c.id_color} value={c.id_color}>{c.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Filtrar por Talle</Form.Label>
                <Form.Select value={filtroTalle} onChange={(e) => setFiltroTalle(e.target.value)}>
                  <option value="">Todos los talles</option>
                  {talles.map((t) => (
                    <option key={t.id_talle} value={t.id_talle}>{t.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Fecha desde</Form.Label>
                <Form.Control type="date" value={filtroFechaDesde} onChange={(e) => setFiltroFechaDesde(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label className="fw-semibold">Fecha hasta</Form.Label>
                <Form.Control type="date" value={filtroFechaHasta} onChange={(e) => setFiltroFechaHasta(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-2 d-flex align-items-end">
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
          <span className="badge bg-light text-dark fs-6">{gruposFiltrados.length} resultados</span>
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
                <th>Talles</th>
                <th>Total</th>
                <th>Observación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {gruposFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-muted py-4">No hay movimientos que coincidan con el filtro.</td>
                </tr>
              ) : (
                gruposFiltrados.map((g) => (
                  <tr key={g.key}>
                    <td>{g.fecha}</td>
                    <td className="text-uppercase">{g.nombre_taller}</td>
                    <td>
                      <span className={`badge ${g.tipo_movimiento === 'INGRESO' ? 'bg-success' : 'bg-danger'}`}>
                        {g.tipo_movimiento}
                      </span>
                    </td>
                    <td className="fw-bold text-uppercase text-start ps-3">
                      {g.nombre_articulo}
                      {g.esLote && g.curva.length > 1 && (
                        <Badge bg="secondary" className="ms-2">{g.curva.length} talles</Badge>
                      )}
                    </td>
                    <td className="text-uppercase">{g.nombre_color}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {g.curva.map((c) => (
                          <span key={c.id_talle} className="badge bg-dark p-2 fs-6">
                            {c.nombre_talle}: <span className="text-warning fw-bold">{c.cantidad}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success p-2 fs-6">{g.total}</span>
                    </td>
                    <td className="text-muted fst-italic">{g.observacion || '—'}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button variant="warning" size="sm" onClick={() => handleAbrirEdicion(g)}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleBorrar(g)}>Borrar</Button>
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
            {grupoEnEdicion?.esLote ? 'Editar Lote' : `Editar Movimiento #${grupoEnEdicion?.ids[0]}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Tipo de Movimiento</Form.Label>
                <Form.Select
                  value={formComun.tipo_movimiento}
                  onChange={(e) => setFormComun({ ...formComun, tipo_movimiento: e.target.value })}
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
                  value={formComun.id_taller}
                  onChange={(e) => setFormComun({ ...formComun, id_taller: e.target.value })}
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
                  value={formComun.id_articulo}
                  onChange={(e) => setFormComun({ ...formComun, id_articulo: e.target.value })}
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
                  value={formComun.id_color}
                  onChange={(e) => setFormComun({ ...formComun, id_color: e.target.value })}
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
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={formComun.fecha}
                  onChange={(e) => setFormComun({ ...formComun, fecha: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Observación</Form.Label>
                <Form.Control
                  type="text"
                  value={formComun.observacion}
                  onChange={(e) => setFormComun({ ...formComun, observacion: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          {grupoEnEdicion?.esLote ? (
            <>
              <Form.Label className="fw-bold text-uppercase text-muted mb-2">Cantidades por Talle:</Form.Label>
              <Row className="row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-2">
                {talles.map((t) => (
                  <Col key={t.id_talle}>
                    <Card className="text-center p-2 border-dark shadow-sm h-100">
                      <Form.Label className="fw-bold mb-1">
                        <span className="badge bg-dark px-2 py-1 fs-6">{t.nombre}</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="0"
                        className="text-center fw-bold mt-1"
                        value={cantidadesLote[t.id_talle] || ''}
                        onChange={(e) => handleCantidadLoteChange(String(t.id_talle), e.target.value)}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Talle</Form.Label>
                  <Form.Select
                    value={formSuelto.id_talle}
                    onChange={(e) => setFormSuelto({ ...formSuelto, id_talle: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    {talles.map((t) => (
                      <option key={t.id_talle} value={t.id_talle}>{t.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={formSuelto.cantidad}
                    onChange={(e) => setFormSuelto({ ...formSuelto, cantidad: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" className="fw-bold" onClick={handleGuardarEdicion}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}