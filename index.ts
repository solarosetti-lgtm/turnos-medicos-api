import app from './app';

const PORT = Number(process.env.PORT) || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}

export { app };
export default app;