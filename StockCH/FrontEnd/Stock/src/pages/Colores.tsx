import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Colores() {
  const [colores, setColores] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mensajeEliminado, setMensajeEliminado] = useState(''); // 👈 NUEVO

  useEffect(() => { cargarColores(); }, []);

  const cargarColores = async () => {
    try {
      const data = await auxiliaresService.getColores();
      setColores(data);
    } catch (err) { setError('Error al cargar los colores.'); }
  };

  const handleEdit = (color: any) => {
    setNombre(color.nombre);
    setEditingId(color.id_color);
    setSuccess(false);
    setMensajeEliminado('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNombre('');
    setError('');
  };

  // 👇 NUEVO: eliminar color
  const handleDelete = async (color: any) => {
    if (!window.confirm(`¿Eliminar el color "${color.nombre}"?`)) return;

    setError('');
    setSuccess(false);
    setMensajeEliminado('');

    try {
      await auxiliaresService.deleteColor(color.id_color);

      // Si justo se estaba editando este color, salir del modo edición
      if (editingId === color.id_color) {
        setEditingId(null);
        setNombre('');
      }

      setMensajeEliminado('¡Color eliminado con éxito!');
      cargarColores();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar el color.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false); setMensajeEliminado('');
    if (!nombre.trim()) return;

    try {
      if (editingId) {
        await auxiliaresService.updateColor(editingId, { nombre: nombre.trim() });
        setEditingId(null);
      } else {
        await auxiliaresService.createColor({ nombre: nombre.trim() });
      }

      setSuccess(true);
      cargarColores();
      setNombre('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el color.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Colores</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{editingId ? '¡Color actualizado con éxito!' : '¡Color registrado con éxito!'}</Alert>}
      {mensajeEliminado && <Alert variant="success">{mensajeEliminado}</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              {editingId ? 'Editar Color' : 'Registrar Nuevo Color'}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="align-items-end">
                  <Col md={9}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Nombre del Color</Form.Label>
                      <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Azul Marino, Negro, Blanco" required />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="text-end d-flex gap-2">
                    {editingId && (
                      <Button variant="outline-secondary" type="button" className="w-100 fw-bold py-2" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    )}
                    <Button variant="dark" type="submit" className="w-100 fw-bold py-2">
                      {editingId ? 'Guardar Cambios' : 'Guardar Color'}
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
            <Card.Header className="bg-secondary text-white fw-bold text-uppercase">Colores Disponibles</Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '15%' }}>ID Color</th>
                    <th>Nombre</th>
                    <th style={{ width: '20%' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {colores.length === 0 ? (
                    <tr><td colSpan={3} className="text-muted py-3">No hay colores registrados.</td></tr>
                  ) : (
                    colores.map((c) => (
                      <tr key={c.id_color}>
                        <td>{c.id_color}</td>
                        <td className="fw-bold text-uppercase">{c.nombre}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button size="sm" variant="warning" onClick={() => handleEdit(c)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(c)}>
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
