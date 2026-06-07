import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Localidades() {
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]); // Estado para el selector

  const [formData, setFormData] = useState({
    nombre: '',
    id_provincia: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    // ➕ ORDENAR ALFABÉTICAMENTE LAS PROVINCIAS (Para el selector desplegable)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.nombre.trim() || !formData.id_provincia) {
      setError('Por favor, ingresa el nombre y selecciona una provincia.');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        id_provincia: Number(formData.id_provincia) // Transformamos a número para NestJS
      };

      await auxiliaresService.createLocalidad(payload);
      setSuccess(true);
      
      // Recargar la tabla
      const listaLocalidades = await auxiliaresService.getLocalidades();
      setLocalidades(listaLocalidades);
      
      setFormData({ nombre: '', id_provincia: '' }); 
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al registrar la localidad.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Localidades</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Localidad registrada con éxito!</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              Registrar Nueva Localidad
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
                  
                  <Col md={3} className="text-end">
                    <Button variant="dark" type="submit" className="w-100 fw-bold py-2">
                      Guardar Localidad
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
                    <th style={{ width: '20%' }}>ID Localidad</th>
                    <th>Nombre / Descripción</th>
                    <th>Provincia</th>
                  </tr>
                </thead>
                <tbody>
                  {localidades.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-muted py-3">No hay localidades registradas en el sistema.</td>
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