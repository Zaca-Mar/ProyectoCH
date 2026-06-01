import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { auxiliaresService } from '../services/api';

export function Talleres() {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<any[]>([]); // Estado para cargar las localidades

  // Estado del formulario mapeado exactamente a las columnas de tu BD
  const [formData, setFormData] = useState({
    nombre: '',
    calle: '',
    numero: '',
    id_localidad: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      // Cargamos tanto los talleres como las localidades en paralelo
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validación básica de campos obligatorios
    if (!formData.nombre || !formData.calle || !formData.numero || !formData.id_localidad) {
      setError('Por favor, completa todos los campos del formulario.');
      return;
    }

    try {
      // Convertimos a número lo que la base de datos espera como entero (numero e id_localidad)
      const payload = {
        nombre: formData.nombre,
        calle: formData.calle,
        numero: Number(formData.numero),
        id_localidad: Number(formData.id_localidad)
      };

      await auxiliaresService.createTaller(payload);
      setSuccess(true);
      
      // Recargar la lista de talleres limpia
      const listaTalleres = await auxiliaresService.getTalleres();
      setTalleres(listaTalleres);
      
      // Resetear el formulario
      setFormData({ nombre: '', calle: '', numero: '', id_localidad: '' }); 
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al registrar el taller.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Talleres</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Taller registrado con éxito!</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              Registrar Nuevo Taller
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
                  <Button variant="dark" type="submit" className="px-4 fw-bold">
                    Guardar Taller
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
                  </tr>
                </thead>
                <tbody>
                  {talleres.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-muted py-3">No hay talleres registrados en el sistema.</td>
                    </tr>
                  ) : (
                    talleres.map((t) => (
                      <tr key={t.id_taller}>
                        <td>{t.id_taller}</td>
                        <td className="fw-bold text-uppercase">{t.nombre}</td>
                        <td>{t.calle}</td>
                        <td>{t.numero}</td>
                        <td>{t.localidad?.nombre || t.id_localidad}</td>
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