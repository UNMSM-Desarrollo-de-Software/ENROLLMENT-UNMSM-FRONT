import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expirationTime: string;
}

export default function GrantCode() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay datos en la URL o en localStorage
    const checkAuthResponse = async () => {
      try {
        // Opción 1: Si tu backend redirige con query parameters
        const { access_token, refresh_token, expiration_time } = router.query;
        
        if (access_token && refresh_token && expiration_time) {
          const authResponse: AuthResponse = {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
            expirationTime: expiration_time as string
          };
          setAuthData(authResponse);
          
          // Guardar tokens en localStorage
          localStorage.setItem('accessToken', authResponse.accessToken);
          localStorage.setItem('refreshToken', authResponse.refreshToken);
          localStorage.setItem('expirationTime', authResponse.expirationTime);
          
          setLoading(false);
          
          // Redirigir al dashboard después de 2 segundos
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
          
          return;
        }

        // Opción 2: Si tu backend envía los datos via postMessage
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== 'https://enrollment-unmsm-379762c4b258.herokuapp.com') {
            return;
          }
          
          if (event.data.type === 'AUTH_SUCCESS') {
            const authResponse: AuthResponse = event.data.payload;
            setAuthData(authResponse);
            
            // Guardar tokens
            localStorage.setItem('accessToken', authResponse.accessToken);
            localStorage.setItem('refreshToken', authResponse.refreshToken);
            localStorage.setItem('expirationTime', authResponse.expirationTime);
            
            setLoading(false);
            
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          }
        };

        window.addEventListener('message', handleMessage);
        
        // Cleanup
        return () => {
          window.removeEventListener('message', handleMessage);
        };

      } catch (err) {
        setError('Error al procesar la autenticación');
        setLoading(false);
      }
    };

    if (router.isReady) {
      checkAuthResponse();
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Procesando autenticación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">¡Autenticación exitosa!</h1>
        <p className="text-gray-600 mb-4">Redirigiendo...</p>
        {authData && (
          <div className="text-sm text-gray-500">
            <p>Token expira: {new Date(authData.expirationTime).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}