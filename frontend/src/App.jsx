import React, { useState } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import 'bootstrap/dist/css/bootstrap.min.css';

const poolData = {
    UserPoolId: 'us-east-1_4Rgib1wIK',
    ClientId: '24a5q70v6ns1tsqv3trttuv63g'
};
const userPool = new CognitoUserPool(poolData);

const BACKEND = 'http://34.203.212.217:8080';

const PEDIDOS_INICIALES = [
    { id: 'PED-1001', producto: 'Laptop AWS Cloud', total: 1200.50, estado: 'Entregado',    despacho: '2026-09-16', entrega: '2026-09-20' },
    { id: 'PED-1002', producto: 'Teclado Mecánico', total: 85.00,   estado: 'En Tránsito', despacho: '2026-09-20', entrega: '2026-09-24' },
    { id: 'PED-1003', producto: 'Monitor 4K',       total: 450.00,  estado: 'Pendiente',   despacho: '2026-09-23', entrega: '2026-09-28' },
];

function App() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken]       = useState(null);
    const [pedidos, setPedidos]   = useState(PEDIDOS_INICIALES);
    const [vista, setVista]       = useState('dashboard');
    const [producto, setProducto] = useState('');
    const [total, setTotal]       = useState('');
    const [backendOk, setBackendOk] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        const authDetails = new AuthenticationDetails({ Username: email, Password: password });
        const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                const jwt = result.getIdToken().getJwtToken();
                setToken(jwt);
                // Intentar cargar desde EC2
                fetch(`${BACKEND}/api/pedidos`, { headers: { Authorization: `Bearer ${jwt}` } })
                    .then(r => r.json())
                    .then(d => { if (Array.isArray(d)) { setPedidos(d); setBackendOk(true); } })
                    .catch(() => setBackendOk(false));
            },
            onFailure: (err) => alert(err.message),
        });
    };

    const crearPedido = (e) => {
        e.preventDefault();
        const hoy = new Date();
        const despacho = new Date(hoy); despacho.setDate(hoy.getDate() + 1);
        const entrega  = new Date(hoy); entrega.setDate(hoy.getDate() + 5);
        const nuevo = {
            id: 'PED-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
            producto,
            total: parseFloat(total),
            estado: 'Pendiente',
            despacho: despacho.toISOString().slice(0, 10),
            entrega: entrega.toISOString().slice(0, 10),
        };

        if (token && backendOk) {
            fetch(`${BACKEND}/api/pedidos`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ producto, total: parseFloat(total) }),
            })
            .then(r => r.json())
            .then(d => setPedidos(prev => [...prev, d]))
            .catch(() => setPedidos(prev => [...prev, nuevo]));
        } else {
            setPedidos(prev => [...prev, nuevo]);
        }
        setProducto(''); setTotal(''); setVista('dashboard');
    };

    const getBadge = (estado) => {
        if (estado === 'Entregado')   return 'bg-success';
        if (estado === 'En Tránsito') return 'bg-warning text-dark';
        return 'bg-primary';
    };

    if (!token) {
        return (
            <div style={{ background: 'linear-gradient(135deg, #0d1117 60%, #161b22 100%)', minHeight: '100vh' }}
                 className="d-flex align-items-center justify-content-center">
                <div className="card shadow-lg" style={{ width: '400px', borderRadius: '16px' }}>
                    <div className="card-body p-5">
                        <h3 className="text-center mb-1 fw-bold">Pedidos360</h3>
                        <p className="text-center text-muted mb-4 small">Autenticación con AWS Cognito</p>
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Email</label>
                                <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Contraseña</label>
                                <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
                                🔐 Iniciar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* SIDEBAR */}
            <div className="bg-dark text-white d-flex flex-column p-3" style={{ width: '240px', minHeight: '100vh' }}>
                <h5 className="fw-bold mb-1 mt-2">📦 Pedidos360</h5>
                <p className="text-muted small mb-4" style={{ fontSize: '11px' }}>{email}</p>
                <hr className="border-secondary" />
                <button className={`btn text-start mb-2 ${vista === 'dashboard' ? 'btn-primary' : 'btn-outline-light'}`}
                    onClick={() => setVista('dashboard')}>
                    📊 Dashboard
                </button>
                <button className={`btn text-start mb-2 ${vista === 'crear' ? 'btn-primary' : 'btn-outline-light'}`}
                    onClick={() => setVista('crear')}>
                    ➕ Nuevo Pedido
                </button>
                <div className="mt-auto">
                    {backendOk !== null && (
                        <div className={`alert py-1 px-2 small mb-2 ${backendOk ? 'alert-success' : 'alert-warning'}`}>
                            {backendOk ? '☁️ EC2 Conectado' : '⚠️ Modo local'}
                        </div>
                    )}
                    <button className="btn btn-outline-danger w-100" onClick={() => setToken(null)}>🚪 Cerrar Sesión</button>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-grow-1 p-5 bg-light">
                {vista === 'dashboard' && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h3 className="fw-bold mb-0">Dashboard de Logística</h3>
                                <p className="text-muted small">Sistema de gestión de pedidos · AWS Cognito + Spring Boot + EC2</p>
                            </div>
                            <button className="btn btn-success" onClick={() => setVista('crear')}>+ Nuevo Pedido</button>
                        </div>

                        {/* Tarjetas resumen */}
                        <div className="row mb-4">
                            {[
                                { label: 'Total Pedidos', value: pedidos.length, color: 'primary' },
                                { label: 'Entregados', value: pedidos.filter(p => p.estado === 'Entregado').length, color: 'success' },
                                { label: 'En Tránsito', value: pedidos.filter(p => p.estado === 'En Tránsito').length, color: 'warning' },
                                { label: 'Pendientes', value: pedidos.filter(p => p.estado === 'Pendiente').length, color: 'info' },
                            ].map((card, i) => (
                                <div className="col-md-3" key={i}>
                                    <div className={`card border-${card.color} shadow-sm`}>
                                        <div className="card-body text-center">
                                            <h2 className={`fw-bold text-${card.color}`}>{card.value}</h2>
                                            <p className="text-muted small mb-0">{card.label}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tabla */}
                        <div className="card shadow-sm">
                            <div className="card-header bg-white fw-bold">Lista de Pedidos</div>
                            <div className="card-body p-0">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Producto</th>
                                            <th>Fecha Despacho</th>
                                            <th>Fecha Entrega</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos.map((p, i) => (
                                            <tr key={i}>
                                                <td><code>{p.id}</code></td>
                                                <td>{p.producto}</td>
                                                <td>📅 {p.despacho || 'N/A'}</td>
                                                <td>🏠 {p.entrega || 'N/A'}</td>
                                                <td><strong>\${p.total?.toFixed ? p.total.toFixed(2) : p.total}</strong></td>
                                                <td><span className={`badge ${getBadge(p.estado)}`}>{p.estado}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {vista === 'crear' && (
                    <div className="mx-auto" style={{ maxWidth: '500px' }}>
                        <h3 className="fw-bold mb-1">Nuevo Pedido</h3>
                        <p className="text-muted small mb-4">El despacho y entrega se calcularán automáticamente</p>
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <form onSubmit={crearPedido}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre del Producto</label>
                                        <input className="form-control" placeholder="Ej: Monitor 4K" value={producto} onChange={e => setProducto(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Precio Total ($)</label>
                                        <input className="form-control" type="number" step="0.01" placeholder="Ej: 299.99" value={total} onChange={e => setTotal(e.target.value)} required />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary flex-grow-1 fw-bold">Confirmar Pedido</button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setVista('dashboard')}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
