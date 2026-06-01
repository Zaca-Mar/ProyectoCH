import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Colores() {
  const [colores, setColores] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => { cargarColores(); }, []);

  const cargarColores = async () => {
    try {
      const data = await auxiliaresService.getColores();
      setColores(data);
    } catch (err) { setError('Error al cargar los colores.'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false);
    if (!nombre.trim()) return;

    try {
      await auxiliaresService.createColor({ nombre: nombre.trim() });
      setSuccess(true);
      cargarColores();
      setNombre('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el color.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Colores</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Color registrado con éxito!</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">Registrar Nuevo Color</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="align-items-end">
                  <Col md={9}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Nombre del Color</Form.Label>
                      <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Azul Marino, Negro, Blanco" required />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button variant="dark" type="submit" className="w-100 fw-bold py-2">Guardar Color</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white fw-bold text-uppercase">Colores Disponibles</Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '20%' }}>ID Color</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {colores.length === 0 ? (
                    <tr><td colSpan={2} className="text-muted py-3">No hay colores registrados.</td></tr>
                  ) : (
                    colores.map((c) => (
                      <tr key={c.id_color}>
                        <td>{c.id_color}</td>
                        <td className="fw-bold text-uppercase">{c.nombre}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}