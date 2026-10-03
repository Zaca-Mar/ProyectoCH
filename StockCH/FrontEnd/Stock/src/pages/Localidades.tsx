import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Localidades() {
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    id_provincia: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mensajeEliminado, setMensajeEliminado] = useState(''); // 👈 NUEVO

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [listaLocalidades, listaProvincias] = await Promise.all([
        auxiliaresService.getLocalidades(),
        auxiliaresService.getProvincias()
      ]);
      const localidadesOrdenadas = listaLocalidades.sort((a: any, b: any) =>
        a.nombre.localeCompare(b.nombre)
      );
      const provinciasOrdenadas = listaProvincias.sort((a: any, b: any) =>
        a.nombre.localeCompare(b.nombre)
      );
      setLocalidades(localidadesOrdenadas);
      setProvincias(provinciasOrdenadas);
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

  const handleEdit = (localidad: any) => {
    setFormData({
      nombre: localidad.nombre,
      id_provincia: String(localidad.provincia?.id_provincia || localidad.id_provincia || '')
    });
    setEditingId(localidad.id_localidad);
    setSuccess(false);
    setMensajeEliminado('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ nombre: '', id_provincia: '' });
    setError('');
  };

  // 👇 NUEVO: eliminar localidad
  const handleDelete = async (localidad: any) => {
    if (!window.confirm(`¿Eliminar la localidad "${localidad.nombre}"?`)) return;

    setError('');
    setSuccess(false);
    setMensajeEliminado('');

    try {
      await auxiliaresService.deleteLocalidad(localidad.id_localidad);

      // Si justo se estaba editando esta localidad, salir del modo edición
      if (editingId === localidad.id_localidad) {
        setEditingId(null);
        setFormData({ nombre: '', id_provincia: '' });
      }

      setMensajeEliminado('¡Localidad eliminada con éxito!');

      const listaLocalidades = await auxiliaresService.getLocalidades();
      setLocalidades(listaLocalidades.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar la localidad.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setMensajeEliminado('');

    if (!formData.nombre.trim() || !formData.id_provincia) {
      setError('Por favor, ingresa el nombre y selecciona una provincia.');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        id_provincia: Number(formData.id_provincia)
      };

      if (editingId) {
        await auxiliaresService.updateLocalidad(editingId, payload);
        setEditingId(null);
      } else {
        await auxiliaresService.createLocalidad(payload);
      }

      setSuccess(true);

      const listaLocalidades = await auxiliaresService.getLocalidades();
      setLocalidades(listaLocalidades.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));

      setFormData({ nombre: '', id_provincia: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar la localidad.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Localidades</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{editingId ? '¡Localidad actualizada con éxito!' : '¡Localidad registrada con éxito!'}</Alert>}
      {mensajeEliminado && <Alert variant="success">{mensajeEliminado}</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              {editingId ? 'Editar Localidad' : 'Registrar Nueva Localidad'}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="align-items-end">
                  <Col md={5} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Nombre de la Localidad</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Villa María, Río Cuarto"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Provincia Destino</Form.Label>
                      <Form.Select
                        name="id_provincia"
                        value={formData.id_provincia}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar provincia...</option>
                        {provincias.map((p) => (
                          <option key={p.id_provincia} value={p.id_provincia}>
                            {p.nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="text-end d-flex gap-2">
                    {editingId && (
                      <Button variant="outline-secondary" type="button" className="w-100 fw-bold py-2" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    )}
                    <Button variant="dark" type="submit" className="w-100 fw-bold py-2">
                      {editingId ? 'Guardar Cambios' : 'Guardar Localidad'}
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
              Localidades Registradas
            </Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '15%' }}>ID Localidad</th>
                    <th>Nombre / Descripción</th>
                    <th>Provincia</th>
                    <th style={{ width: '20%' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {localidades.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-muted py-3">No hay localidades registradas en el sistema.</td>
                    </tr>
                  ) : (
                    localidades.map((loc) => (
                      <tr key={loc.id_localidad}>
                        <td>{loc.id_localidad}</td>
                        <td className="fw-bold text-uppercase text-start ps-5">{loc.nombre}</td>
                        <td>
                          <span className="badge bg-dark text-uppercase px-3 py-2">
                            {loc.provincia?.nombre || loc.id_provincia || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button size="sm" variant="warning" onClick={() => handleEdit(loc)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(loc)}>
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
