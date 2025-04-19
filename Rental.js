const prompt = require("prompt-sync")({ sigint: true });

// =====Vehicle class====
class Vehicle {
    constructor(id, model, type) {
        this.id = id;
        this.model = model;
        this.type = type;
        this.is_rented = false;
    }

    markAsRented() {
        this.is_rented = true;
    }

    markAsReturned() {
        this.is_rented = false;
    }
}

// ====Customer class=====
class Customer {
    constructor(name, customer_id) {
        this.name = name;
        this.customer_id = customer_id;
        this.rented_vehicles = [];
    }

    rentVehicle(vehicle) {
        if (!vehicle.is_rented) {
            vehicle.markAsRented();
            this.rented_vehicles.push(vehicle);
            console.log(`✅ Car rented out: ${vehicle.model}`);
        } else {
            console.log(`❌ Car is already rented: ${vehicle.model}`);
        }
    }

    returnVehicles(vehicle) {
        const index = this.rented_vehicles.indexOf(vehicle);
        if (index !== -1) {
            vehicle.markAsReturned();
            this.rented_vehicles.splice(index, 1);
            console.log(`✅ Car returned: ${vehicle.model}`);
        } else {
            console.log(`❌ You did not rent this car: ${vehicle.model}`);
        }
    }

    listRentedVehicles() {
        if (this.rented_vehicles.length === 0) {
            console.log("🚫 No rented cars.");
        } else {
            console.log("📋 Rented Cars:");
            this.rented_vehicles.forEach(vehicle => {
                console.log(`- ${vehicle.model} (${vehicle.type})`);
            });
        }
    }
}

// =====Rental System=====
class RentalSystem {
    constructor() {
        this.vehicles = [];
        this.customers = [];
    }

    addVehicle(type, model) {
        const id = this.vehicles.length + 1;
        const vehicle = new Vehicle(id, model, type);
        this.vehicles.push(vehicle);
        console.log(`🚗 Vehicle added: ${model} (${type})`);
    }

    addCustomer(name) {
        const customer_id = this.customers.length + 1;
        const customer = new Customer(name, customer_id);
        this.customers.push(customer);
        console.log(`👤 Customer added: ${name}`);
    }

    findVehicleById(id) {
        return this.vehicles.find(vehicle => vehicle.id === id);
    }

    findCustomerById(id) {
        return this.customers.find(customer => customer.customer_id === id);
    }

    showAvailableVehicles() {
        const available = this.vehicles.filter(vehicle => !vehicle.is_rented);
        if (available.length === 0) {
            console.log("❌ No cars available.");
        } else {
            console.log("✅ Available Cars:");
            available.forEach(vehicle => {
                console.log(`${vehicle.id}. ${vehicle.model} (${vehicle.type})`);
            });
        }
    }
}

// ====Main Program====
const rental = new RentalSystem();

while (true) {
    console.log("\n=== Welcome to 🚘 Car Rental System ===");
    const role = prompt("Login as 'admin' or 'customer' (or type 'exit' to quit): ").toLowerCase();

    if (role === "admin") {
        while (true) {
            console.log("\n--- 👨‍💼 Admin Menu ---");
            console.log("1. Add Vehicle");
            console.log("2. Add Customer");
            console.log("3. Show Available Vehicles");
            console.log("4. Back to Role Selection");

            const adminChoice = prompt("Choose an option (1 - 4): ");
            switch (adminChoice) {
                case "1":
                    const model = prompt("Enter Car Model: ");
                    const type = prompt("Enter Car Type: ");
                    rental.addVehicle(type, model);
                    break;
                case "2":
                    const name = prompt("Enter Customer Name: ");
                    rental.addCustomer(name);
                    break;
                case "3":
                    rental.showAvailableVehicles();
                    break;
                case "4":
                    break; // back to role selection
                default:
                    console.log("❌ Invalid option.");
            }

            if (adminChoice === "4") break;
        }
    } else if (role === "customer") {
        const customerId = parseInt(prompt("Enter your Customer ID: "));
        const customer = rental.findCustomerById(customerId);
        if (!customer) {
            console.log("❌ Customer not found.");
            continue;
        }

        while (true) {
            console.log(`\n--- 👤 Customer Menu (Welcome ${customer.name}) ---`);
            console.log("1. Rent a Vehicle");
            console.log("2. Return a Vehicle");
            console.log("3. View My Rented Vehicles");
            console.log("4. Back to Role Selection");

            const custChoice = prompt("Choose an option (1 - 4): ");
            switch (custChoice) {
                case "1":
                    rental.showAvailableVehicles();
                    const rentId = parseInt(prompt("Enter vehicle ID to rent: "));
                    const vehicleToRent = rental.findVehicleById(rentId);
                    if (vehicleToRent) {
                        customer.rentVehicle(vehicleToRent);
                    } else {
                        console.log("❌ Vehicle not found.");
                    }
                    break;
                case "2":
                    customer.listRentedVehicles();
                    const returnId = parseInt(prompt("Enter vehicle ID to return: "));
                    const vehicleToReturn = rental.findVehicleById(returnId);
                    if (vehicleToReturn) {
                        customer.returnVehicles(vehicleToReturn);
                    } else {
                        console.log("❌ Vehicle not found.");
                    }
                    break;
                case "3":
                    customer.listRentedVehicles();
                    break;
                case "4":
                    break; // back to role selection
                default:
                    console.log("❌ Invalid option.");
            }

            if (custChoice === "4") break;
        }
    } else if (role === "exit") {
        console.log("👋 Exiting the system. Goodbye!");
        break;
    } else {
        console.log("❌ Invalid role. Please type 'admin' or 'customer'.");
    }
}
