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
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0]);

  const [idArticuloSeleccionado, setIdArticuloSeleccionado] = useState('');
  const [idColorSeleccionado, setIdColorSeleccionado] = useState('');
  const [cantidadesTemporales, setCantidadesTemporales] = useState<{ [key: string]: string }>({});

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
      setTalles(tal);
    } catch (err) {
      setError('Error al cargar los datos de los selectores.');
    }
  };

  const handleCantidadTalleChange = (idTalle: string, valor: string) => {
    setCantidadesTemporales(prev => ({ ...prev, [idTalle]: valor }));
  };

  const agregarBloqueTallesALista = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idTaller) {
      setError('Primero debes seleccionar un Taller Destino para poder añadir artículos.');
      return;
    }

    if (!idArticuloSeleccionado || !idColorSeleccionado) {
      setError('Por favor, selecciona un Artículo y un Color antes de agregar la curva.');
      return;
    }

    const tallesConCantidad = Object.entries(cantidadesTemporales)
      .map(([id_talle, cant]) => ({ id_talle, cantidad: Number(cant) }))
      .filter(t => !isNaN(t.cantidad) && t.cantidad > 0);

    if (tallesConCantidad.length === 0) {
      setError('Debes ingresar al menos una cantidad mayor a cero en alguno de los talles.');
      return;
    }

    const artSelected = articulos.find(x => x.id_articulo === Number(idArticuloSeleccionado));
    const colSelected = colores.find(x => x.id_color === Number(idColorSeleccionado));

    const nuevosItems: DetalleArticulo[] = tallesConCantidad.map(item => {
      const talleSelected = talles.find(x => x.id_talle === Number(item.id_talle));
      return {
        id_articulo: idArticuloSeleccionado,
        nombre_articulo: artSelected?.nombre || 'Artículo',
        id_color: idColorSeleccionado,
        nombre_color: colSelected?.nombre || 'Color',
        id_talle: item.id_talle,
        nombre_talle: talleSelected?.nombre || 'Talle',
        cantidad: item.cantidad
      };
    });

    setListaDetalle([...listaDetalle, ...nuevosItems]);
    setIdArticuloSeleccionado('');
    setIdColorSeleccionado('');
    setCantidadesTemporales({});
  };

  const eliminarBloqueDeLista = (idArt: string, idCol: string) => {
    setListaDetalle(prev => prev.filter(item => !(item.id_articulo === idArt && item.id_color === idCol)));
  };

  const guardarMovimientoFinal = async () => {
    setError('');
    setSuccess(false);

    if (!idTaller) {
      setError('Debes seleccionar un taller obligatorio para procesar el remito.');
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
          fecha: fechaIngreso
        } as any);
      });

      await Promise.all(solicitudes);
      setSuccess(true);
      setListaDetalle([]);
      setObservacion('');
      setIdTaller('');
      setFechaIngreso(new Date().toISOString().split('T')[0]);
    } catch (err: any) {
      setError('Error al registrar el bloque de movimientos en el servidor.');
    }
  };

  // 🛠️ AGRUPACIÓN PARA EL RESUMEN VISUAL
  const mapaResumen: { [key: string]: { id_articulo: string; id_color: string; nombre_articulo: string; nombre_color: string; curva: { [talle: string]: number } } } = {};
  listaDetalle.forEach(item => {
    const clave = `${item.id_articulo}-${item.id_color}`;
    if (!mapaResumen[clave]) {
      mapaResumen[clave] = {
        id_articulo: item.id_articulo,
        id_color: item.id_color,
        nombre_articulo: item.nombre_articulo,
        nombre_color: item.nombre_color,
        curva: {}
      };
    }
    mapaResumen[clave].curva[item.nombre_talle] = (mapaResumen[clave].curva[item.nombre_talle] || 0) + item.cantidad;
  });
  const resumenAgrupado = Object.values(mapaResumen);

  // 🧮 TOTAL POR ARTÍCULO/COLOR Y TOTAL GENERAL DEL REMITO
  const totalPorGrupo = (curva: { [talle: string]: number }) =>
    Object.values(curva).reduce((acc, cant) => acc + cant, 0);

  const totalGeneral = listaDetalle.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Registrar Ingreso a Taller</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Remito de movimientos registrado con éxito total!</Alert>}

      {/* SECCIÓN 1 */}
      <Card className="shadow-sm mb-4 border-dark">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase">1. Datos Generales del Remito</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Tipo de Operación</Form.Label>
                <Form.Select value={tipoMovimiento} onChange={(e) => setTipoMovimiento(e.target.value)} className="fw-bold text-uppercase" disabled={listaDetalle.length > 0}>
                  <option value="INGRESO">🟢 INGRESO al TALLER</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Taller Destino</Form.Label>
                <Form.Select value={idTaller} onChange={(e) => setIdTaller(e.target.value)} disabled={listaDetalle.length > 0} required>
                  <option value="">Seleccionar un taller...</option>
                  {talleres.map(t => <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Fecha de Ingreso</Form.Label>
                <Form.Control type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} disabled={listaDetalle.length > 0} required />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">Observaciones (Opcional)</Form.Label>
                <Form.Control type="text" value={observacion} onChange={(e) => setObservacion(e.target.value)} placeholder="Ej: Corte número 24 - Remeras" />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* SECCIÓN 2 */}
      <Card className="shadow-sm mb-4 border-secondary">
        <Card.Header className="bg-secondary text-white fw-bold text-uppercase">2. Carga de Artículos</Card.Header>
        <Card.Body>
          <Form onSubmit={agregarBloqueTallesALista}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Artículo</Form.Label>
                  <Form.Select value={idArticuloSeleccionado} onChange={(e) => setIdArticuloSeleccionado(e.target.value)}>
                    <option value="">Selecciona la prenda...</option>
                    {articulos.map(a => <option key={a.id_articulo} value={a.id_articulo}>{a.nombre}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Color Articulo</Form.Label>
                  <Form.Select value={idColorSeleccionado} onChange={(e) => setIdColorSeleccionado(e.target.value)}>
                    <option value="">Selecciona el color...</option>
                    {colores.map(c => <option key={c.id_color} value={c.id_color}>{c.nombre}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {idArticuloSeleccionado && idColorSeleccionado && (
              <Card className="bg-light mb-3">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Label className="fw-bold text-uppercase mb-0 text-muted">Ingresar Cantidades por Talle:</Form.Label>
                    <span className="badge bg-dark fs-6">
                      Total a agregar: {Object.values(cantidadesTemporales).reduce((acc, v) => acc + (Number(v) || 0), 0)}
                    </span>
                  </div>
                  <Row className="row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-2">
                    {talles.map(t => (
                      <Col key={t.id_talle}>
                        <Card className="text-center p-2 border-dark shadow-sm h-100">
                          <Form.Label className="fw-bold mb-1"><span className="badge bg-dark px-2 py-1 fs-6">{t.nombre}</span></Form.Label>
                          <Form.Control type="number" min="0" placeholder="0" className="text-center fw-bold mt-1" value={cantidadesTemporales[t.id_talle] || ''} onChange={(e) => handleCantidadTalleChange(t.id_talle, e.target.value)} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <div className="text-end mt-4">
                    <Button variant="secondary" type="submit" className="fw-bold px-4 py-2">➕ Agregar Talles</Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* SECCIÓN 3: CONSOLIDADA */}
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase d-flex justify-content-between align-items-center">
          <span>Resumen de Artículos Listados en el Remito</span>
          <div className="d-flex gap-2">
            <span className="badge bg-light text-dark fs-6">Modelos: {resumenAgrupado.length}</span>
            <span className="badge bg-warning text-dark fs-6">Total unidades: {totalGeneral}</span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered hover responsive className="mb-0 text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th>Artículo / Prenda</th>
                <th>Color</th>
                <th>Talles</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {resumenAgrupado.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted py-4">El remito está vacío. Selecciona artículo y color arriba.</td>
                </tr>
              ) : (
                resumenAgrupado.map((item, index) => (
                  <tr key={index}>
                    <td className="fw-bold text-uppercase text-start ps-4">{item.nombre_articulo}</td>
                    <td className="text-uppercase">{item.nombre_color}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {Object.entries(item.curva).map(([talle, cant]) => (
                          <span key={talle} className="badge bg-dark p-2 fs-6">
                            {talle}: <span className="text-warning fw-bold">{cant}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success p-2 fs-6">{totalPorGrupo(item.curva)}</span>
                    </td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => eliminarBloqueDeLista(item.id_articulo, item.id_color)}>Borrar</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {resumenAgrupado.length > 0 && (
              <tfoot>
                <tr className="table-dark">
                  <td colSpan={3} className="text-end fw-bold text-uppercase pe-3">Total general</td>
                  <td className="fw-bold fs-5">{totalGeneral}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </Table>
        </Card.Body>
        {listaDetalle.length > 0 && (
          <Card.Footer className="bg-light p-3 text-end">
            <Button variant="success" size="lg" className="fw-bold px-5 py-2 shadow" onClick={guardarMovimientoFinal}>Registrar Movimiento Completo</Button>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
}
