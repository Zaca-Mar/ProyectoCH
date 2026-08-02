import { Container, Row, Col, Card, Button } from 'react-bootstrap';

interface InicioProps {
  onNavigate: (pantalla: string) => void;
}

export function Inicio({ onNavigate }: InicioProps) {
  const opciones = [
    {
      titulo: 'Cargar Movimientos',
      descripcion: 'Registrar ingresos de mercadería en el stock.',
      id: 'movimientos',
      variante: 'info',
    },
    {
      titulo: 'Egresos de Taller',
      descripcion: 'Ver prendas que te debe cada taller y registrar las entregas.',
      id: 'info',
      variante: 'danger', 
    },
    {
      titulo: 'Consultar Stock',
      descripcion: 'Filtrar y revisar la cantidad de prendas por taller y estado.',
      id: 'consultas',
      variante: 'info', 
    },
    {
      titulo: 'Cargar Talleres',
      descripcion: 'Gestionar y dar de alta nuevos talleres en el sistema.',
      id: 'talleres',
      variante: 'info',
    },
    {
      titulo: 'Cargar Artículos',
      descripcion: 'Administrar el catálogo de productos y artículos.',
      id: 'articulos',
      variante: 'info',
    },
    
    {
      titulo: 'Cargar Colores',
      descripcion: 'Gestionar y dar de alta nuevos colores en el sistema.',
      id: 'colores',
      variante: 'info',
    },
    {
      titulo: 'Cargar Localidades',
      descripcion: 'Administrar las localidades disponibles para los talleres.',
      id: 'localidades',
      variante: 'info', 
    },
    
  ];

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-uppercase tracking-wide" style={{ fontSize: '2.5rem' }}>
          Bienvenido al Sistema
        </h1>
        <p className="text-muted fs-5">Que quieres hacer hoy?</p>
      </div>

      <Row className="w-100 justify-content-center g-4">
        {opciones.map((opcion) => (
          <Col key={opcion.id} xs={12} md={4} className="d-flex">
            <Card className="shadow-sm w-100 border-0 h-100 text-center transition-card">
              <Card.Body className="d-flex flex-column justify-content-between p-4">
                <div>
                  <Card.Title className="fw-bold mb-3 fs-4">{opcion.titulo}</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    {opcion.descripcion}
                  </Card.Text>
                </div>
                <Button 
                  variant={opcion.variante} 
                  className="w-100 fw-bold py-2 mt-auto"
                  onClick={() => onNavigate(opcion.id)}
                >
                  Ingresar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}