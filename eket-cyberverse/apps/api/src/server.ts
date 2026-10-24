import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🛡️  EKET CYBERVERSE API SERVER INITIALIZED`);
  console.log(`Org: Heartcode Technologies`);
  console.log(`Tagline: "From Security Intelligence to Verified Resilience."`);
  console.log(`Listening on http://localhost:${PORT}/api`);
  console.log(`Health probe: http://localhost:${PORT}/api/health`);
  console.log(`========================================================`);
});
