export async function getSaludo(): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saludo`);
  if (!res.ok) throw new Error('Error al conectarse con el backend');
  const data = await res.json();
  return data.mensaje;
}
