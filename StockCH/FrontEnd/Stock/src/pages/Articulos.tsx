import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Articulos() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mensajeEliminado, setMensajeEliminado] = useState(''); // 👈 NUEVO

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

  const handleEdit = (articulo: any) => {
    setNombre(articulo.nombre);
    setEditingId(articulo.id_articulo);
    setSuccess(false);
    setMensajeEliminado('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNombre('');
    setError('');
  };

  // 👇 NUEVO: eliminar artículo
  const handleDelete = async (articulo: any) => {
    if (!window.confirm(`¿Eliminar el artículo "${articulo.nombre}"?`)) return;

    setError('');
    setSuccess(false);
    setMensajeEliminado('');

    try {
      await auxiliaresService.deleteArticulo(articulo.id_articulo);

      // Si justo se estaba editando este artículo, salir del modo edición
      if (editingId === articulo.id_articulo) {
        setEditingId(null);
        setNombre('');
      }

      setMensajeEliminado('¡Artículo eliminado con éxito!');
      cargarArticulos();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar el artículo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setMensajeEliminado('');

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
      {mensajeEliminado && <Alert variant="success">{mensajeEliminado}</Alert>}

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
                    <th style={{ width: '20%' }}>Acciones</th>
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
                          <div className="d-flex gap-2 justify-content-center">
                            <Button size="sm" variant="warning" onClick={() => handleEdit(a)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(a)}>
                              Eliminar
                            </Button>
                          </div>
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
