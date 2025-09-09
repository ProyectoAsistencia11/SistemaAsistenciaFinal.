const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const QRCode = require("qrcode");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/qr', express.static(path.join(__dirname, 'qr')));
app.use('/Icon', express.static(path.join(__dirname, 'Icon')));

// Conexión a MySQL
const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistemadeasistencia_db"
});

conexion.connect(err => {
  if (err) {
    console.error("Error de conexión:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

// Validar contraseña
app.post("/validar", (req, res) => {
  const claveIngresada = req.body.clave;
  if (!claveIngresada) return res.status(400).send("Clave no proporcionada");

  const consulta = "SELECT * FROM config WHERE clave = ?";
  conexion.query(consulta, [claveIngresada], (err, resultados) => {
    if (err) return res.status(500).send("Error en el servidor");
    res.send(resultados.length > 0 ? "ok" : "error");
  });
});

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Endpoint para guardar alumno
app.post("/api/alumnos", upload.single('imagen'), async (req, res) => {
  try {
    console.log("Cuerpo de la solicitud:", req.body);
    const { nombre, tutor, telefono, aula } = req.body;
    const imagen = req.file ? req.file.filename : null;

    if (!nombre || !tutor || !telefono) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // Generar QR
    const qrData = `${nombre}-${telefono}-${Date.now()}`;
    const qrDir = path.join(__dirname, 'qr');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir);
    const qrFilename = `${nombre}_${telefono}_${Date.now()}.png`;
    const qrPath = path.join(qrDir, qrFilename);
    await QRCode.toFile(qrPath, qrData);

    // Guardar en la base de datos
    const sql = "INSERT INTO alumnos (nombre, tutor, telefono, aula, imagen, qr) VALUES (?, ?, ?, ?, ?, ?)";
    conexion.query(sql, [nombre, tutor, telefono, aula, imagen, qrFilename], (err, result) => {
      if (err) {
        console.error("Error MySQL:", err);
        return res.status(500).json({ error: "Error al guardar en la base de datos", detalle: err.message });
      }
      res.json({
        mensaje: "Alumno guardado",
        id: result.insertId,
        imagen: imagen,
        qr: qrFilename
      });
    });
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en puerto 3000");
});
