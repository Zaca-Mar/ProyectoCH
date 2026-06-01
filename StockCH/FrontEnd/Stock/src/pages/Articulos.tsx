import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Articulos() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [nombre, setNombre] = useState(''); // Estado simple ya que es un único campo de texto

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const data = await auxiliaresService.getArticulos();
      setArticulos(data);
    } catch (err) {
      setError('Error al conectar con el servidor para cargar los artículos.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!nombre.trim()) {
      setError('Por favor, ingresa el nombre del artículo.');
      return;
    }

    try {
      await auxiliaresService.createArticulo({ nombre: nombre.trim() });
      setSuccess(true);
      
      // Recargar la tabla automáticamente
      cargarArticulos(); 
      // Resetear el campo de entrada
      setNombre(''); 
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al registrar el artículo.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Artículos</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Artículo registrado con éxito!</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              Registrar Nuevo Artículo
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="align-items-end">
                  <Col md={9} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Nombre del Artículo</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Ej: Remera Ombu"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="text-end">
                    <Button variant="dark" type="submit" className="w-100 fw-bold py-2">
                      Guardar Artículo
                    </Button>
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
            <Card.Header className="bg-secondary text-white fw-bold text-uppercase">
              Catálogo de Artículos Registrados
            </Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '20%' }}>ID Artículo</th>
                    <th>Nombre / Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {articulos.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-muted py-3">No hay artículos registrados en el sistema.</td>
                    </tr>
                  ) : (
                    articulos.map((a) => (
                      <tr key={a.id_articulo}>
                        <td>{a.id_articulo}</td>
                        <td className="fw-bold text-uppercase text-start ps-5">{a.nombre}</td>
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