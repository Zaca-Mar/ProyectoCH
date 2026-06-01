import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Badge } from 'react-bootstrap';
import { movimientosService, auxiliaresService } from '../services/api';

export function Consultas() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);

  const [filtro, setFiltro] = useState({
    id_taller: '',
    id_estado: ''
  });

  const [resultados, setResultados] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);

  useEffect(() => {
    cargarFiltros();
  }, []);

  const cargarFiltros = async () => {
    try {
      const [listaTalleres, listaEstados] = await Promise.all([
        auxiliaresService.getTalleres(),
        auxiliaresService.getEstados()
      ]);
      setTalleres(listaTalleres);
      setEstados(listaEstados);
    } catch (err) {
      setError('Error al cargar los criterios de filtrado.');
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value
    });
  };

  const handleFiltrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBuscado(false);

    if (!filtro.id_taller || !filtro.id_estado) {
      setError('Por favor, selecciona un taller y un estado para realizar la consulta.');
      return;
    }

    try {
      const data = await movimientosService.filtrar(
        Number(filtro.id_taller),
        Number(filtro.id_estado)
      );
      setResultados(data);
      setBuscado(true);
    } catch (err: any) {
      setError('Error al obtener el reporte del taller seleccionado.');
    }
  };

  // ➕ FUNCIÓN MODIFICADA: Calcula la suma total de las cantidades encontradas
  const calcularTotalStock = () => {
    return resultados.reduce((total, item) => total + Number(item.cantidad || 0), 0);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Consulta de Stock por Taller</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Panel de Filtros */}
      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              Filtros de Búsqueda
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleFiltrar}>
                <Row className="align-items-end">
                  <Col md={5} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Seleccionar Taller</Form.Label>
                      <Form.Select 
                        name="id_taller" 
                        value={filtro.id_taller} 
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar taller...</option>
                        {talleres.map((t) => (
                          <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={5} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Estado de la Mercadería</Form.Label>
                      <Form.Select 
                        name="id_estado" 
                        value={filtro.id_estado} 
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar estado...</option>
                        {estados.map((e) => (
                          <option key={e.id_estado} value={e.id_estado}>{e.nombre}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Button variant="dark" type="submit" className="w-100 fw-bold py-2">
                      Buscar Stock
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de Resultados y Totales */}
      {buscado && (
        <Row>
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-secondary text-white fw-bold text-uppercase d-flex justify-content-between align-items-center">
                <span>Resultados del Stock en Taller</span>
                
                {/* ➕ MODIFICACIÓN: Badge dinámico que muestra la suma total */}
                {resultados.length > 0 && (
                  <Badge bg="dark" className="fs-6 px-3 py-2 text-uppercase">
                    Total en Taller: {calcularTotalStock()} unidades
                  </Badge>
                )}
              </Card.Header>
              <Card.Body className="p-0">
                <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID Movimiento</th>
                      <th>Artículo</th>
                      <th>Color</th>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-muted py-3">
                          No se encontraron registros que coincidan con el taller y estado seleccionados.
                        </td>
                      </tr>
                    ) : (
                      <>
                        {resultados.map((item) => (
                          <tr key={item.id_movimiento}>
                            <td>{item.id_movimiento}</td>
                            <td className="fw-bold text-uppercase">{item.articulo?.nombre || item.id_articulo}</td>
                            <td>{item.color?.nombre || item.id_color}</td>
                            <td>
                              <span className={`badge ${item.tipo_movimiento === 'INGRESO' ? 'bg-success' : 'bg-danger'}`}>
                                {item.tipo_movimiento}
                              </span>
                            </td>
                            <td className="fw-bold">{item.cantidad}</td>
                          </tr>
                        ))}
                        
                        {/* ➕ MODIFICACIÓN: Fila extra al final de la tabla como doble verificación */}
                        <tr className="table-group-divider fw-bold table-light">
                          <td colSpan={4} className="text-end pe-4 text-uppercase">Suma Total del Reporte:</td>
                          <td className="text-dark fs-5">{calcularTotalStock()}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}