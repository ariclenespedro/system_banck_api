const mongoose = require("mongoose");
const Client = require("../models/Client");

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/system_bank_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log("✅ Conectado ao MongoDB!");

  const existingClients = await Client.find();
  if (existingClients.length > 0) {
    console.log("⚠️ Base de dados já inicializada!");
    return mongoose.connection.close();
  }

  // Criar cliente de teste
  const newClient = new Client({
    fullName: "João Silva",
    email: "joao@email.com",
    age: 30,
    phone: "999999999",
    n_acession: 12345,
    password: "123456"
  });

  await newClient.save();
  console.log("✅ Cliente inserido!");

  mongoose.connection.close();
}

// Executa a função
seedDatabase();
