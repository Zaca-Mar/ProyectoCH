import { Fragment, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService, movimientosService } from '../services/api';

// ====================================================================
// 📌 CONFIGURACIÓN DE COLUMNAS FIJAS (STICKY) PARA EL SCROLL HORIZONTAL
//    Estos anchos se usan tanto en el header como en cada fila del body,
//    para que las columnas queden alineadas al scrollear. Si cambiás
//    el contenido y necesitás más lugar, ajustá estos valores.
// ====================================================================
const ANCHOS = {
  fecha: 95,
  operacion: 90,
  descripcion: 180,
  color: 110,
  cantidad: 70,
  saldoDeuda: 110,
};

const OFFSET_IZQ = {
  fecha: 0,
  operacion: ANCHOS.fecha,
  descripcion: ANCHOS.fecha + ANCHOS.operacion,
  color: ANCHOS.fecha + ANCHOS.operacion + ANCHOS.descripcion,
  cantidad: ANCHOS.fecha + ANCHOS.operacion + ANCHOS.descripcion + ANCHOS.color, // 👈 NUEVO
};

const SOMBRA_IZQ: CSSProperties = { boxShadow: '2px 0 4px -2px rgba(0,0,0,0.35)' };

// background es obligatorio: una celda sticky SIN fondo opaco deja ver el
// contenido que pasa por detrás al hacer scroll, así que siempre hay que
// pasar un color sólido que coincida con el de esa fila.
const stickyIzq = (offset: number, ancho: number, background: string, extra: CSSProperties = {}): CSSProperties => ({
  position: 'sticky',
  left: offset,
  width: ancho,
  minWidth: ancho,
  background,
  zIndex: 2,
  ...extra,
});

export function Consultas() {
  // Selectores para cargar las opciones del backend
  const [talleres, setTalleres] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [talles, setTalles] = useState<any[]>([]);

  // Estados de los filtros seleccionados por el usuario
  const [idTaller, setIdTaller] = useState('');
  const [idArticuloFiltro, setIdArticuloFiltro] = useState('');
  const [idColorFiltro, setIdColorFiltro] = useState('');
  const [idTalleFiltro, setIdTalleFiltro] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Datos base descargados
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  useEffect(() => {
    Promise.all([
      auxiliaresService.getTalleres(),
      auxiliaresService.getArticulos(),
      auxiliaresService.getColores(),
      auxiliaresService.getTalles()
    ]).then(([t, a, c, tal]) => {
      setTalleres(t.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setArticulos(a.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      setColores(c.sort((x: any, y: any) => x.nombre.localeCompare(y.nombre)));
      // Ordenamos los talles para que la cabecera mantenga coherencia en la curva
      setTalles(tal.sort((x: any, y: any) => Number(x.id_talle) - Number(y.id_talle)));
    }).catch(() => {
      setError('Error al cargar los selectores de filtrado avanzado.');
    });
  }, []);

  const manejarBusquedaPrincipal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusquedaRealizada(false);

    if (!idTaller) {
      setError('Por favor, selecciona un Taller para realizar la consulta.');
      return;
    }

    try {
      const todosLosMovimientos = await movimientosService.getAll();
      const filtradosPorTaller = todosLosMovimientos.filter(
        (m: any) => m.taller?.id_taller === Number(idTaller)
      );
      setMovimientos(filtradosPorTaller);
      setBusquedaRealizada(true);
    } catch (err) {
      setError('Error al obtener el historial de stock para el taller seleccionado.');
    }
  };

  // ====================================================================
  // 🛠️ 1. FILTRADO MULTI-CRITERIO BASE (Prendas, Colores y Talle enfocado)
  // ====================================================================
  const movimientosFiltradosOpciones = movimientos.filter((mov: any) => {
    if (idArticuloFiltro && mov.articulo?.id_articulo !== Number(idArticuloFiltro)) return false;
    if (idColorFiltro && mov.color?.id_color !== Number(idColorFiltro)) return false;
    if (idTalleFiltro && mov.talle?.id_talle !== Number(idTalleFiltro)) return false;
    return true;
  });

  // ====================================================================
  // 🛠️ 2. AGRUPACIÓN CRONOLÓGICA POR REMITO (De más viejo a más nuevo)
  // ====================================================================
  const mapaPreAgrupado: { [key: string]: { 
    fecha: string;
    tipo_movimiento: string;
    id_articulo: number;
    id_color: number;
    nombre_articulo: string;
    nombre_color: string;
    observacion: string;
    cantidadesOperacion: { [id_talle: number]: number };
  }} = {};

  movimientosFiltradosOpciones.forEach((mov: any) => {
    const idArt = mov.articulo?.id_articulo;
    const idCol = mov.color?.id_color;
    const tipo = mov.tipo_movimiento;
    const fecha = mov.fecha || 'S/D';
    const idTalle = mov.talle?.id_talle;
    const cantidad = Number(mov.cantidad || 0);
    const obs = mov.observacion || '';

    if (!idArt || !idCol || !idTalle) return;

    const clave = `${idArt}-${idCol}-${tipo}-${fecha}-${obs.substring(0, 30)}`;

    if (!mapaPreAgrupado[clave]) {
      mapaPreAgrupado[clave] = {
        fecha: fecha,
        tipo_movimiento: tipo,
        id_articulo: idArt,
        id_color: idCol,
        nombre_articulo: mov.articulo.nombre,
        nombre_color: mov.color.nombre,
        observacion: obs,
        cantidadesOperacion: {}
      };
    }

    mapaPreAgrupado[clave].cantidadesOperacion[idTalle] = (mapaPreAgrupado[clave].cantidadesOperacion[idTalle] || 0) + cantidad;
  });

  const remitosCronologicos = Object.values(mapaPreAgrupado).sort((a, b) => a.fecha.localeCompare(b.fecha));

  // ====================================================================
  // 🛠️ 3. CÁLCULO DEL SALDO ACUMULADO GENERAL + SALDO ACUMULADO POR TALLE
  //     (el saldo por talle se lleva por separado para cada artículo-color,
  //      porque el talle "S" de una prenda no tiene nada que ver con el
  //      talle "S" de otra)
  // ====================================================================
  const historialConSaldos: any[] = [];
  let saldoAcumuladoGeneral = 0;
  const saldoPorArticuloColor: { [claveArtCol: string]: { [id_talle: number]: number } } = {};

  remitosCronologicos.forEach(remito => {
    const factor = remito.tipo_movimiento === 'INGRESO' ? 1 : -1;
    const totalPrendasFila = Object.values(remito.cantidadesOperacion).reduce((sum, c) => sum + c, 0);

    // Balance acumulado general: Ingresos suman, Retiros restan
    saldoAcumuladoGeneral += (totalPrendasFila * factor);

    // Balance acumulado propio de ESTE artículo + color, talle por talle
    const claveArtCol = `${remito.id_articulo}-${remito.id_color}`;
    if (!saldoPorArticuloColor[claveArtCol]) {
      saldoPorArticuloColor[claveArtCol] = {};
    }
    Object.entries(remito.cantidadesOperacion).forEach(([idTalleStr, cant]) => {
      const idTalleNum = Number(idTalleStr);
      const saldoAnterior = saldoPorArticuloColor[claveArtCol][idTalleNum] || 0;
      saldoPorArticuloColor[claveArtCol][idTalleNum] = saldoAnterior + (cant * factor);
    });

    const totalSaldoArticuloActual = Object.values(saldoPorArticuloColor[claveArtCol]).reduce((sum, c) => sum + c, 0);

    historialConSaldos.push({
      ...remito,
      totalFilaOperacion: totalPrendasFila,
      totalSaldoAcumulado: saldoAcumuladoGeneral,
      // Foto del saldo por talle de este artículo-color justo después de este movimiento
      saldoPorTalleActual: { ...saldoPorArticuloColor[claveArtCol] },
      totalSaldoArticuloActual
    });
  });

  // ====================================================================
  // 🛠️ 4. FILTRADO VISUAL FINAL POR RANGO DE FECHAS
  // ====================================================================
  const datosVisiblesTabla = historialConSaldos.filter(item => {
    if (fechaDesde && item.fecha < fechaDesde) return false;
    if (fechaHasta && item.fecha > fechaHasta) return false;
    return true;
  });

  // El indicador superior muestra la foto real de la deuda arrastrada en la fecha límite filtrada
  const granTotalNeto = datosVisiblesTabla.length > 0 
    ? datosVisiblesTabla[datosVisiblesTabla.length - 1].totalSaldoAcumulado 
    : 0;

  // Invertimos el orden para que lo más nuevo figure arriba de todo en la grilla visual
  const datosRenderizados = [...datosVisiblesTabla].reverse();

  const limpiarFiltrosAvanzados = () => {
    setIdArticuloFiltro('');
    setIdColorFiltro('');
    setIdTalleFiltro('');
    setFechaDesde('');
    setFechaHasta('');
  };

  // Texto/color explicativo reutilizable para cualquier saldo (general o por artículo)
  const obtenerTextoSaldo = (valor: number) => {
    if (valor > 0) return { texto: `Debe ${valor}`, clase: 'text-primary fw-bold' };
    if (valor < 0) return { texto: `A Favor ${Math.abs(valor)}`, clase: 'text-danger fw-bold' };
    return { texto: 'Al día', clase: 'text-success fw-semibold' };
  };

  // ====================================================================
  // 🛠️ 5. RESUMEN GENERAL DE SALDO POR TALLE "A LA FECHA DE CONSULTA"
  //     Toma, para cada combinación artículo+color, su último movimiento
  //     dentro del rango filtrado (el estado más actual de cada uno) y
  //     suma esos saldos por talle entre todos los artículos del taller.
  // ====================================================================
  const saldoFinalPorCombo: { [claveArtCol: string]: { [id_talle: number]: number } } = {};
  datosVisiblesTabla.forEach(item => {
    const claveArtCol = `${item.id_articulo}-${item.id_color}`;
    saldoFinalPorCombo[claveArtCol] = item.saldoPorTalleActual;
  });

  const resumenSaldoPorTalle: { [id_talle: number]: number } = {};
  Object.values(saldoFinalPorCombo).forEach(curvaCombo => {
    Object.entries(curvaCombo).forEach(([idTalleStr, saldo]) => {
      const idTalleNum = Number(idTalleStr);
      resumenSaldoPorTalle[idTalleNum] = (resumenSaldoPorTalle[idTalleNum] || 0) + saldo;
    });
  });

  return (
    <Container fluid className="mt-4 mb-5 px-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Consulta de Stock por Taller</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* BLOQUE FILTRO PRINCIPAL */}
      <Card className="shadow-sm mb-3 border-dark">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase">Taller a Consultar</Card.Header>
        <Card.Body>
          <Form onSubmit={manejarBusquedaPrincipal}>
            <Row className="align-items-end">
              <Col md={9} className="mb-2">
                <Form.Group>
                  <Form.Label className="fw-bold">Seleccionar Taller</Form.Label>
                  <Form.Select value={idTaller} onChange={(e) => { setIdTaller(e.target.value); setBusquedaRealizada(false); }} required>
                    <option value="">Selecciona el taller a consultar...</option>
                    {talleres.map(t => <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-2">
                <Button variant="dark" type="submit" className="w-100 fw-bold py-2">Consultar</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* BLOQUE FILTROS AVANZADOS DINÁMICOS */}
      {busquedaRealizada && (
        <Card className="shadow-sm mb-4 border-secondary bg-light">
          <Card.Header className="bg-secondary text-white fw-semibold text-uppercase d-flex justify-content-between align-items-center py-2">
            <span>Selección de Filtros</span>
            <Button variant="link" className="text-white p-0 text-decoration-none fw-bold" style={{ fontSize: '0.85rem' }} onClick={limpiarFiltrosAvanzados}>
              Limpiar Filtros
            </Button>
          </Card.Header>
          <Card.Body className="py-2">
            <Row className="g-2">
              <Col md={3} sm={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Prenda / Artículo</Form.Label>
                  <Form.Select value={idArticuloFiltro} onChange={(e) => setIdArticuloFiltro(e.target.value)}>
                    <option value="">Todos los artículos...</option>
                    {articulos.map(a => <option key={a.id_articulo} value={a.id_articulo}>{a.nombre}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} sm={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Color</Form.Label>
                  <Form.Select value={idColorFiltro} onChange={(e) => setIdColorFiltro(e.target.value)}>
                    <option value="">Todos...</option>
                    {colores.map(c => <option key={c.id_color} value={c.id_color}>{c.nombre}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} sm={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Talle</Form.Label>
                  <Form.Select value={idTalleFiltro} onChange={(e) => setIdTalleFiltro(e.target.value)}>
                    <option value="">Todos los talles...</option>
                    {talles.map(t => <option key={t.id_talle} value={t.id_talle}>{t.nombre}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} sm={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Desde Fecha</Form.Label>
                  <Form.Control type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={2} sm={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Hasta Fecha </Form.Label>
                  <Form.Control type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* 📊 RESUMEN GENERAL DE SALDO POR TALLE, A LA FECHA DE CONSULTA */}
      {busquedaRealizada && datosVisiblesTabla.length > 0 && (
        <Card className="shadow-sm mb-3 border-primary">
          <Card.Header className="bg-primary text-white fw-bold text-uppercase">
            📊 Saldo Pendiente por Talle (a la fecha de consulta)
          </Card.Header>
          <Card.Body className="d-flex flex-wrap gap-2">
            {talles
              .filter(t => (resumenSaldoPorTalle[t.id_talle] || 0) !== 0)
              .map(t => {
                const saldo = resumenSaldoPorTalle[t.id_talle];
                const esDeuda = saldo > 0;
                return (
                  <span
                    key={t.id_talle}
                    className={`badge p-2 fs-6 ${esDeuda ? 'bg-primary' : 'bg-danger'}`}
                  >
                    Talle {t.nombre}: {esDeuda ? 'Debe' : 'A favor'} {Math.abs(saldo)}
                  </span>
                );
              })}
            {talles.filter(t => (resumenSaldoPorTalle[t.id_talle] || 0) !== 0).length === 0 && (
              <span className="text-success fw-semibold">🎉 Sin saldo pendiente en ningún talle.</span>
            )}
          </Card.Body>
        </Card>
      )}

      {/* PLANILLA DE CONTROL FINAL */}
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase d-flex justify-content-between align-items-center">
          <span>Planilla de Control Taller</span>
          {busquedaRealizada && (
            <span className="badge bg-light text-dark fs-6 text-uppercase fw-bold">
              {granTotalNeto >= 0 ? 'DEUDA' : 'SALDO A FAVOR'}: {Math.abs(granTotalNeto)} UNIDADES
            </span>
          )}
        </Card.Header>
        <Card.Body className="p-0" style={{ overflowX: 'auto' }}>
          <Table striped bordered hover responsive className="mb-0 text-center align-middle table-sm">
            <thead className="table-secondary border-dark">
              <tr>
                <th rowSpan={2} className="align-middle" style={stickyIzq(OFFSET_IZQ.fecha, ANCHOS.fecha, '#e2e3e5')}>Fecha</th>
                <th rowSpan={2} className="align-middle" style={stickyIzq(OFFSET_IZQ.operacion, ANCHOS.operacion, '#e2e3e5')}>Operación</th>
                <th rowSpan={2} className="align-middle" style={stickyIzq(OFFSET_IZQ.descripcion, ANCHOS.descripcion, '#e2e3e5')}>Descripción / Artículo</th>
                <th rowSpan={2} className="align-middle" style={stickyIzq(OFFSET_IZQ.color, ANCHOS.color, '#e2e3e5')}>Color</th>
                {/* 👇 MOVIDO: Cant. ahora va pegado a Color, antes de los Talles */}
                <th rowSpan={2} className="align-middle text-white" style={stickyIzq(OFFSET_IZQ.cantidad, ANCHOS.cantidad, '#212529', SOMBRA_IZQ)}>Cant.</th>
                <th colSpan={talles.length} className="bg-dark text-white py-1 text-uppercase small"> Talles </th>
                <th rowSpan={2} className="align-middle table-active text-dark" style={{ minWidth: ANCHOS.saldoDeuda }}>Saldo Deuda</th>
              </tr>
              <tr className="bg-light">
                {talles.map(t => (
                  <th key={t.id_talle} style={{ minWidth: '50px', fontSize: '0.85rem' }} className="fw-bold text-uppercase">
                    {t.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosRenderizados.length === 0 ? (
                <tr>
                  <td colSpan={6 + talles.length} className="text-muted py-4 fs-6">
                    {busquedaRealizada ? 'No se encontraron registros activos.' : 'Selecciona un taller arriba y haz clic en Consultar.'}
                  </td>
                </tr>
              ) : (
                datosRenderizados.map((item: any, index) => {
                  const esIngreso = item.tipo_movimiento === 'INGRESO';

                  // Estructuración del texto explicativo de la Cuenta Corriente (saldo general)
                  const { texto: textoSaldo, clase: claseColorSaldo } = obtenerTextoSaldo(item.totalSaldoAcumulado);

                  // Texto explicativo del saldo propio de este artículo + color (para el renglón intermedio)
                  const { texto: textoSaldoArticulo, clase: claseColorSaldoArticulo } = obtenerTextoSaldo(item.totalSaldoArticuloActual);

                  return (
                    <Fragment key={index}>
                      {/* 📊 RENGLÓN DE SALDO: va PRIMERO, mostrando el resultado acumulado
                          por talle para este artículo/color justo después de este movimiento */}
                      <tr className="table-light">
                        <td
                          colSpan={5}
                          className="text-end small fw-bold text-uppercase text-muted pe-3"
                          style={{ position: 'sticky', left: 0, zIndex: 2, background: '#f8f9fa' }}
                        >
                          📊 Saldo actual — {item.nombre_articulo} ({item.nombre_color})
                        </td>
                        {talles.map(t => {
                          const saldoTalle = item.saldoPorTalleActual[t.id_talle];
                          let colorTexto = '#adb5bd';
                          if (saldoTalle > 0) colorTexto = '#0d6efd';
                          else if (saldoTalle < 0) colorTexto = '#dc3545';
                          else if (saldoTalle === 0) colorTexto = '#198754';
                          return (
                            <td key={t.id_talle} className="small fw-bold" style={{ color: colorTexto }}>
                              {saldoTalle !== undefined ? saldoTalle : '-'}
                            </td>
                          );
                        })}
                        <td className="small fw-bold bg-light">
                          {item.totalSaldoArticuloActual}
                        </td>
                        <td className={`small text-nowrap ${claseColorSaldoArticulo}`}>
                          {textoSaldoArticulo}
                        </td>
                      </tr>

                      {/* Fila del movimiento que generó ese saldo */}
                      <tr>
                        <td className="small text-muted fw-semibold" style={stickyIzq(OFFSET_IZQ.fecha, ANCHOS.fecha, '#fff')}>
                          {item.fecha !== 'S/D' ? item.fecha.split('-').reverse().join('/') : 'S/D'}
                        </td>
                        <td style={stickyIzq(OFFSET_IZQ.operacion, ANCHOS.operacion, '#fff')}>
                          <span className={`badge ${esIngreso ? 'bg-success' : 'bg-danger'} px-2 py-1 text-uppercase fw-bold`} style={{ fontSize: '0.75rem' }}>
                            {esIngreso ? 'ENTRADA' : 'RETIRO'}
                          </span>
                        </td>
                        <td
                          className="fw-bold text-uppercase text-start ps-2"
                          style={{ fontSize: '0.9rem', ...stickyIzq(OFFSET_IZQ.descripcion, ANCHOS.descripcion, '#fff') }}
                        >
                          {item.nombre_articulo}
                          {item.observacion && (
                            <span className="text-muted d-block small fw-normal text-lowercase mt-0.5">
                              📝 {item.observacion}
                            </span>
                          )}
                        </td>
                        <td
                          className="text-uppercase small fw-semibold text-secondary"
                          style={stickyIzq(OFFSET_IZQ.color, ANCHOS.color, '#fff')}
                        >
                          {item.nombre_color}
                        </td>

                        {/* 👇 MOVIDO: Cantidad total neta del remito, ahora sticky y pegada a Color */}
                        <td
                          className="fw-bold fs-6 bg-light text-muted"
                          style={stickyIzq(OFFSET_IZQ.cantidad, ANCHOS.cantidad, '#fff', SOMBRA_IZQ)}
                        >
                          {item.totalFilaOperacion}
                        </td>

                        {/* 🚀 RENDEREADO DE NÚMEROS LIMPIOS (SIN SIGNOS + NI -) */}
                        {talles.map(t => {
                          const cantNativa = item.cantidadesOperacion[t.id_talle];
                          return (
                            <td 
                              key={t.id_talle} 
                              className={`fw-bold ${cantNativa ? 'table-warning border-dark' : ''}`}
                              style={{ 
                                fontSize: '0.95rem',
                                color: cantNativa ? (esIngreso ? '#198754' : '#dc3545') : '#bcbcbc'
                              }}
                            >
                              {cantNativa !== undefined ? cantNativa : '-'}
                            </td>
                          );
                        })}

                        {/* 🎯 SALDO GENERAL EXPLICITADO EN PALABRAS */}
                        <td className={`fs-6 table-active text-nowrap ${claseColorSaldo}`}>
                          {textoSaldo}
                        </td>
                      </tr>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}