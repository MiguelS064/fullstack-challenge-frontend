import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export const metadata = {
  title: 'Dashboard - StackExchange y Vuelos',
  description: 'Dashboard de visualizacion de datos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
