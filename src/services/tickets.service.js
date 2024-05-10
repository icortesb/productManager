import Ticket from "../dao/mongo/models/ticket.model";

export const findTickets = async () => {
    try {
        return await Ticket.find();
    } catch (error) {
        throw new Error(`Error al leer los tickets: ${error.message}`);
    }
}

export const findTicketById = async (id) => {
    try {
        return await Ticket
            .findById(id)
            .populate('purchaser', 'email');
    }
    catch (error) {
        throw new Error(`Error al leer el ticket: ${error.message}`);
    }
}

export const findTicketByIdLean = async (id) => {
    try {
        return await Ticket.findById(id).lean();
    }
    catch (error) {
        throw new Error(`Error al leer el ticket: ${error.message}`);
    }
}

export const createTicket = async (amount, purchaser) => {
    try {
        const newTicket = await Ticket.create({
            amount,
            purchaser
        });
        return await Ticket.findById(newTicket._id).lean();
    }
    catch (error) {
        throw new Error(`Error al crear el ticket: ${error.message}`);
    }
}