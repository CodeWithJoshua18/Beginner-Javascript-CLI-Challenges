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
        return this.vehicles.find(vehicle => vehicle.id == id);
    }

    findCustomerById(id) {
        return this.customers.find(customer => customer.customer_id == id);
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
    console.log("\n=== 🚘 Car Rental System ===");
    console.log("1. Add Vehicle");
    console.log("2. Add Customer");
    console.log("3. Rent Vehicle");
    console.log("4. Return Vehicle");
    console.log("5. View Rented Vehicles");
    console.log("6. Show Available Vehicles");
    console.log("7. Exit");

    const choice = prompt("Choose an option (1 - 7): ");

    switch (choice) {
        case "1":
            const model = prompt("Enter Car Model: ");
            const type = prompt("Enter Car Type: ");
            rental.addVehicle(type, model);
            break;

        case "2":
            const userName = prompt("Enter your name: ");
            rental.addCustomer(userName);
            break;

        case "3":
            const rentUserId = prompt("Enter your customer ID: ");
            const rentVehicleId = prompt("Enter vehicle ID to rent: ");
            const renter = rental.findCustomerById(parseInt(rentUserId));
            const vehicleToRent = rental.findVehicleById(parseInt(rentVehicleId));
            if (renter && vehicleToRent) {
                renter.rentVehicle(vehicleToRent);
            } else {
                console.log("❌ Invalid customer or vehicle ID.");
            }
            break;

        case "4":
            const returnUserId = prompt("Enter your customer ID: ");
            const returnVehicleId = prompt("Enter vehicle ID to return: ");
            const returner = rental.findCustomerById(parseInt(returnUserId));
            const vehicleToReturn = rental.findVehicleById(parseInt(returnVehicleId));
            if (returner && vehicleToReturn) {
                returner.returnVehicles(vehicleToReturn);
            }
            else {
                console.log("❌ Invalid customer or vehicle ID.");
            }
            break;
        case "5":
            const viewUserId = prompt("Enter your customer ID: ");
            const viewer = rental.findCustomerById(parseInt(viewUserId));
            if (viewer) {
                viewer.listRentedVehicles();
            } else {
                console.log("❌ Invalid customer ID.");
            }
            break;
        case "6":
            rental.showAvailableVehicles();
            break;
        case "7":
            console.log("👋 Exiting the system. Goodbye!");
            process.exit(0);
        default:
    }
}
