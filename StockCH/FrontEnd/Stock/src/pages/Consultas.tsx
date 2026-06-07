import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService, movimientosService } from '../services/api';

export function Consultas() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [idTaller, setIdTaller] = useState('');
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  useEffect(() => {
    // Cargar la lista de talleres al inicio para el selector
    auxiliaresService.getTalleres().then(data => {
      setTalleres(data.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));
    });
  }, []);

  const manejarBusqueda = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusquedaRealizada(false);

    if (!idTaller) {
      setError('Por favor, selecciona un taller para realizar la consulta.');
      return;
    }

    try {
      // 🛠️ SOLUCIÓN: Usamos getAll() y filtramos en el Front-End por ID de taller.
      // Esto evita romper tu API si todavía espera recibir obligatoriamente un id_estado.
      const todosLosMovimientos = await movimientosService.getAll();
      
      const filtrados = todosLosMovimientos.filter(
        (m: any) => m.taller?.id_taller === Number(idTaller)
      );

      setMovimientos(filtrados);
      setBusquedaRealizada(true);
    } catch (err) {
      setError('Error al obtener el historial de stock para el taller seleccionado.');
    }
  };

  // 🛠️ MATEMÁTICA CORREGIDA: Suma ingresos y resta egresos
  const totalStock = movimientos.reduce((sum, mov) => {
    if (mov.tipo_movimiento === 'INGRESO') {
      return sum + Number(mov.cantidad || 0);
    } else if (mov.tipo_movimiento === 'EGRESO') {
      return sum - Number(mov.cantidad || 0);
    }
    return sum;
  }, 0);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Consulta de Stock por Taller</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {/* FILTROS DE BÚSQUEDA */}
      <Card className="shadow-sm mb-4 border-dark">
        <Card.Header className="bg-dark text-white fw-bold text-uppercase">
          Filtros de Búsqueda
        </Card.Header>
        <Card.Body>
          <Form onSubmit={manejarBusqueda}>
            <Row className="align-items-end">
              <Col md={8} className="mb-2">
                <Form.Group>
                  <Form.Label className="fw-semibold">Seleccionar Taller</Form.Label>
                  <Form.Select 
                    value={idTaller} 
                    onChange={(e) => setIdTaller(e.target.value)}
                    required
                  >
                    <option value="">Selecciona el taller a consultar...</option>
                    {talleres.map(t => (
                      <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-2">
                <Button variant="dark" type="submit" className="w-100 fw-bold py-2">
                  🔍 Buscar Stock
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* RESULTADOS DE LA TABLA */}
      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white fw-bold text-uppercase d-flex justify-content-between align-items-center">
          <span>Resultados del Stock en Taller</span>
          {busquedaRealizada && movimientos.length > 0 && (
            <span className="badge bg-light text-dark fs-6 text-uppercase fw-bold">
              Total Neto: {totalStock} Unidades
            </span>
          )}
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered hover responsive className="mb-0 text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Fecha</th> {/* ➕ Agregada columna de fecha */}
                <th>Artículo / Prenda</th>
                <th>Talle</th> {/* ➕ Agregada columna de talle */}
                <th>Color</th>
                <th>Tipo</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-muted py-4 fs-6">
                    {busquedaRealizada 
                      ? 'No se encontraron registros para el taller seleccionado.' 
                      : 'Selecciona un taller arriba y haz clic en "Buscar Stock".'
                    }
                  </td>
                </tr>
              ) : (
                movimientos.map((mov) => (
                  <tr key={mov.id_movimiento}>
                    <td>{mov.id_movimiento}</td>
                    {/* Formatea la fecha de YYYY-MM-DD a DD/MM/YYYY visual */}
                    <td className="fw-semibold">
                      {mov.fecha ? mov.fecha.split('-').reverse().join('/') : 'S/D'}
                    </td>
                    <td className="fw-bold text-uppercase text-start ps-3">{mov.articulo?.nombre}</td>
                    <td><span className="badge bg-dark px-2 py-1">{mov.talle?.nombre || 'N/A'}</span></td>
                    <td className="text-uppercase">{mov.color?.nombre}</td>
                    <td>
                      <span className={`badge ${mov.tipo_movimiento === 'INGRESO' ? 'bg-success' : 'bg-danger'}`}>
                        {mov.tipo_movimiento === 'INGRESO' ? 'INGRESO' : 'EGRESO'}
                      </span>
                    </td>
                    <td className="fw-bold fs-6">{mov.cantidad}</td>
                  </tr>
                ))
              )}
            </tbody>
            {movimientos.length > 0 && (
              <tfoot>
                <tr className="table-light fw-bold fs-5">
                  <td colSpan={6} className="text-end text-uppercase">Suma Total del Reporte:</td>
                  <td className={totalStock < 0 ? 'text-danger' : 'text-success'}>
                    {totalStock}
                  </td>
                </tr>
              </tfoot>
            )}
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}