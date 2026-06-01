import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { movimientosService, auxiliaresService } from '../services/api';

export function MovimientosStock() {
  // Estados para los datos de las tablas auxiliares (Selectores)
  const [articulos, setArticulos] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [talleres, setTalleres] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  
  // Estado para la lista de movimientos (Tabla)
  const [movimientos, setMovimientos] = useState<any[]>([]);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    tipo_movimiento: 'INGRESO',
    cantidad: '',
    id_articulo: '',
    id_color: '',
    id_taller: '',
    id_estado: ''
  });

  // Estados de feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
    cargarMovimientos();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [art, col, tal, est] = await Promise.all([
        auxiliaresService.getArticulos(),
        auxiliaresService.getColores(),
        auxiliaresService.getTalleres(),
        auxiliaresService.getEstados(),
      ]);
      setArticulos(art);
      setColores(col);
      setTalleres(tal);
      setEstados(est);
    } catch (err) {
      setError('Error al conectar con el servidor para cargar los datos iniciales.');
    }
  };

  const cargarMovimientos = async () => {
    try {
      const data = await movimientosService.getAll();
      setMovimientos(data);
    } catch (err) {
      console.error('Error al cargar movimientos', err);
    }
  };

  // Manejar cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Enviar formulario al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validación básica de campos vacíos
    if (!formData.cantidad || !formData.id_articulo || !formData.id_color || !formData.id_taller || !formData.id_estado) {
      setError('Por favor, completa todos los campos del formulario.');
      return;
    }

    try {
      const payload = {
        tipo_movimiento: formData.tipo_movimiento,
        cantidad: Number(formData.cantidad),
        id_articulo: Number(formData.id_articulo),
        id_color: Number(formData.id_color),
        id_taller: Number(formData.id_taller),
        id_estado: Number(formData.id_estado),
      };

      await movimientosService.create(payload);
      setSuccess(true);
      cargarMovimientos(); // Recargar la tabla automáticamente
      
      // Resetear cantidad
      setFormData({ ...formData, cantidad: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el movimiento en el servidor.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center text-uppercase fw-bold">Gestión de Stock </h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">¡Movimiento registrado con éxito!</Alert>}

      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white fw-bold text-uppercase">
              Registrar Movimiento de Stock
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={2} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Tipo</Form.Label>
                      <Form.Select name="tipo_movimiento" value={formData.tipo_movimiento} onChange={handleChange}>
                        <option value="INGRESO">INGRESO</option>
                        <option value="EGRESO">EGRESO</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Cantidad</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="cantidad" 
                        value={formData.cantidad} 
                        onChange={handleChange} 
                        placeholder="Ej: 50"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Artículo</Form.Label>
                      <Form.Select name="id_articulo" value={formData.id_articulo} onChange={handleChange}>
                        <option value="">Seleccionar...</option>
                        {articulos.map((a) => <option key={a.id_articulo} value={a.id_articulo}>{a.nombre}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Color</Form.Label>
                      <Form.Select name="id_color" value={formData.id_color} onChange={handleChange}>
                        <option value="">Seleccionar...</option>
                        {colores.map((c) => <option key={c.id_color} value={c.id_color}>{c.nombre}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Taller</Form.Label>
                      <Form.Select name="id_taller" value={formData.id_taller} onChange={handleChange}>
                        <option value="">Seleccionar...</option>
                        {talleres.map((t) => <option key={t.id_taller} value={t.id_taller}>{t.nombre}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-semibold">Estado</Form.Label>
                      <Form.Select name="id_estado" value={formData.id_estado} onChange={handleChange}>
                        <option value="">Seleccionar...</option>
                        {estados.map((e) => <option key={e.id_estado} value={e.id_estado}>{e.nombre}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-end">
                  <Button variant="dark" type="submit" className="px-4 fw-bold">
                    Guardar Registro
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
              Historial de Movimientos Recientes
            </Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Fecha / Hora</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Artículo</th>
                    <th>Color</th>
                    <th>Taller</th>
                    <th>Estado Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-muted py-3">No hay movimientos registrados en el sistema.</td>
                    </tr>
                  ) : (
                    movimientos.map((m) => (
                      <tr key={m.id_movimiento}>
                        <td>{m.id_movimiento}</td>
                        <td>{new Date(m.fecha_hora_movimiento).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${m.tipo_movimiento === 'INGRESO' ? 'bg-success' : 'bg-danger'}`}>
                            {m.tipo_movimiento}
                          </span>
                        </td>
                        <td className="fw-bold">{m.cantidad}</td>
                        <td>{m.articulo?.nombre || m.id_articulo}</td>
                        <td>{m.color?.nombre || m.id_color}</td>
                        <td>{m.taller?.nombre || m.id_taller}</td>
                        <td>{m.estado?.nombre || m.id_estado}</td>
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