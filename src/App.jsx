import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [tipoBusqueda, setTipoBusqueda] = useState('personajes'); // Tipo de búsqueda por defecto

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      setError(null);

      try {
        let url;
        switch (tipoBusqueda) {
          case 'personajes':
            url = 'https://swapi.dev/api/people/';
            break;
          case 'planetas':
            url = 'https://swapi.dev/api/planets/';
            break;
          case 'naves':
            url = 'https://swapi.dev/api/starships/';
            break;
          default:
            url = 'https://swapi.dev/api/people/';
        }

        const response = await axios.get(url);
        setDatos(response.data.results);
      } catch (error) {
        setError(error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [tipoBusqueda]);

  const handleChangeBusqueda = (event) => {
    setTerminoBusqueda(event.target.value);
  };

  const handleChangeTipoBusqueda = (event) => {
    setTipoBusqueda(event.target.value);
    setTerminoBusqueda(''); // Reiniciar término de búsqueda al cambiar tipo de búsqueda
  };

  const datosFiltrados = datos.filter((item) =>
    item.name.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const renderizarInformacionAdicional = (item) => {
    switch (tipoBusqueda) {
      case 'personajes':
        return (
          <>
            <strong>Altura:</strong> {item.height} cm<br />
            <strong>Peso:</strong> {item.mass} kg<br />
            <strong>Color de Pelo:</strong> {item.hair_color}<br />
            <strong>Color de Piel:</strong> {item.skin_color}<br />
            <strong>Color de Ojos:</strong> {item.eye_color}<br />
            <strong>Año de Nacimiento:</strong> {item.birth_year}<br />
            <strong>Género:</strong> {item.gender}<br />
            <strong>Planeta de Origen:</strong> {item.homeworld}<br />
            <strong>Naves:</strong> {item.starships.join(', ')}
          </>
        );
      case 'planetas':
        return (
          <>
            <strong>Clima:</strong> {item.climate}<br />
            <strong>Terreno:</strong> {item.terrain}<br />
            <strong>Población:</strong> {item.population}<br />
            <strong>Gravedad:</strong> {item.gravity}
          </>
        );
      case 'naves':
        return (
          <>
            <strong>Modelo:</strong> {item.model}<br />
            <strong>Fabricante:</strong> {item.manufacturer}<br />
            <strong>Costo en Créditos:</strong> {item.cost_in_credits}<br />
            <strong>Longitud:</strong> {item.length} m<br />
            <strong>Equipo:</strong> {item.crew}<br />
            <strong>Pasajeros:</strong> {item.passengers}
          </>
        );
      default:
        return null;
    }
  };

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <Form.Group controlId="busqueda">
        <Form.Control
          type="text"
          placeholder={`Buscar ${tipoBusqueda}...`}
          value={terminoBusqueda}
          onChange={handleChangeBusqueda}
        />
      </Form.Group>
      <Form.Group controlId="tipoBusqueda">
        <Form.Control as="select" value={tipoBusqueda} onChange={handleChangeTipoBusqueda}>
          <option value="personajes">Personajes</option>
          <option value="planetas">Planetas</option>
          <option value="naves">Naves</option>
        </Form.Control>
      </Form.Group>
      <Row>
        {datosFiltrados.map((item, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  {renderizarInformacionAdicional(item)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default App;
