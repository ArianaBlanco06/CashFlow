const Perfil = () => {
  return (
    <div>
      <h2>⚙️ Configuración de Perfil</h2>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Administra tu información personal y preferencias.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>

        <div>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
            Nombre completo
          </label>
          <input type="text" defaultValue="Juan Pérez" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
            Correo electrónico
          </label>
          <input type="text" defaultValue="juan.perez@ulima.edu.pe" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>
            Rol
          </label>
          <input type="text" defaultValue="Administrador" style={{ width: '100%' }} />
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button>Guardar cambios</button>
        </div>

      </div>
    </div>
  );
};

export default Perfil;