import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Talleres() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nombre: '',
    calle: '',
    numero: '',
    id_localidad: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null); // 👈 NUEVO
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [listaTalleres, listaLocalidades] = await Promise.all([
        auxiliaresService.getTalleres(),
        auxiliaresService.getLocalidades()
      ]);
      setTalleres(listaTalleres);
      setLocalidades(listaLocalidades);
    } catch (err) {
      setError('Error al conectar con el servidor para cargar los datos iniciales.');
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 👇 NUEVO: precarga el formulario con los datos del taller elegido
  const handleEdit = (taller: any) => {
    setFormData({
      nombre: taller.nombre,
      calle: taller.calle,
      numero: String(taller.numero),
      id_localidad: String(taller.localidad?.id_localidad || taller.id_localidad || '')
    });
    setEditingId(taller.id_taller);
    setSuccess(false);
    setError('');
  };

  // 👇 NUEVO: cancela el modo edición y limpia el formulario
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ nombre: '', calle: '', numero: '', id_localidad: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.nombre || !formData.calle || !formData.numero || !formData.id_localidad) {
      setError('Por favor, completa todos los campos del formulario.');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        calle: formData.calle,
        numero: Number(formData.numero),
        id_localidad: Number(formData.id_localidad)
      };

      if (editingId) {
        // 👇 Modo edición
        await auxiliaresService.updateTaller(editingId, payload);
        setEditingId(null);
      } else {
        // Modo creación (como antes)
        await auxiliaresService.createTaller(payload);
      }

      setSuccess(true);

      const listaTalleres = await auxiliaresService.getTalleres();
      setTalleres(listaTalleres);

      setFormData({ nombre: '', calle: '', numero: '', id_localidad: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el taller.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Talleres</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{editingId ? '¡Taller actualizado con éxito!' : '¡Taller registrado con éxito!'}</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              {editingId ? 'Editar Taller' : 'Registrar Nuevo Taller'}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Nombre del Taller</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Taller Central Chango"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Calle</Form.Label>
                      <Form.Control
                        type="text"
                        name="calle"
                        value={formData.calle}
                        onChange={handleChange}
                        placeholder="Ej: San Martín"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Número</Form.Label>
                      <Form.Control
                        type="number"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="Ej: 450"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Localidad</Form.Label>
                      <Form.Select
                        name="id_localidad"
                        value={formData.id_localidad}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {localidades.map((loc) => (
                          <option key={loc.id_localidad} value={loc.id_localidad}>
                            {loc.nombre || loc.id_localidad}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-end">
                  {editingId && (
                    <Button variant="outline-secondary" type="button" className="px-4 fw-bold me-2" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  )}
                  <Button variant="dark" type="submit" className="px-4 fw-bold">
                    {editingId ? 'Guardar Cambios' : 'Guardar Taller'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white fw-bold text-uppercase">
              Listado de Talleres Activos
            </Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Calle</th>
                    <th>Número</th>
                    <th>Localidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {talleres.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-muted py-3">No hay talleres registrados en el sistema.</td>
                    </tr>
                  ) : (
                    talleres.map((t) => (
                      <tr key={t.id_taller}>
                        <td>{t.id_taller}</td>
                        <td className="fw-bold text-uppercase">{t.nombre}</td>
                        <td>{t.calle}</td>
                        <td>{t.numero}</td>
                        <td>{t.localidad?.nombre || t.id_localidad}</td>
                        <td>
                          <Button size="sm" variant="warning" onClick={() => handleEdit(t)}>
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