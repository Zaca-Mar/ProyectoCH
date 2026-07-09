import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Articulos() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null); // 👈 NUEVO

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

  // 👇 NUEVO
  const handleEdit = (articulo: any) => {
    setNombre(articulo.nombre);
    setEditingId(articulo.id_articulo);
    setSuccess(false);
    setError('');
  };

  // 👇 NUEVO
  const handleCancelEdit = () => {
    setEditingId(null);
    setNombre('');
    setError('');
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
      if (editingId) {
        await auxiliaresService.updateArticulo(editingId, { nombre: nombre.trim() });
        setEditingId(null);
      } else {
        await auxiliaresService.createArticulo({ nombre: nombre.trim() });
      }

      setSuccess(true);
      cargarArticulos();
      setNombre('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el artículo.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Artículos</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{editingId ? '¡Artículo actualizado con éxito!' : '¡Artículo registrado con éxito!'}</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              {editingId ? 'Editar Artículo' : 'Registrar Nuevo Artículo'}
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

                  <Col md={3} className="text-end d-flex gap-2">
                    {editingId && (
                      <Button variant="outline-secondary" type="button" className="w-100 fw-bold py-2" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    )}
                    <Button variant="dark" type="submit" className="w-100 fw-bold py-2">
                      {editingId ? 'Guardar Cambios' : 'Guardar Artículo'}
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
                    <th style={{ width: '15%' }}>ID Artículo</th>
                    <th>Nombre / Descripción</th>
                    <th style={{ width: '15%' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {articulos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-muted py-3">No hay artículos registrados en el sistema.</td>
                    </tr>
                  ) : (
                    articulos.map((a) => (
                      <tr key={a.id_articulo}>
                        <td>{a.id_articulo}</td>
                        <td className="fw-bold text-uppercase text-start ps-5">{a.nombre}</td>
                        <td>
                          <Button size="sm" variant="warning" onClick={() => handleEdit(a)}>
                            Editar
                          </Button>
                        </td>
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