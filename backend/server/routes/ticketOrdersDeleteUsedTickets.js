const express = require('express');
const router = express.Router();
const TicketOrder = require('../models/ticketOrderModel');

router.delete('/deleteUsedTickets', async (req, res) => {
    try {
        const {username} = req.params;

        const ticketOrders = await TicketOrder.find({username});

        if (ticketOrders.length === 0) {
            return res.status(404).json({error: "No username found"});
        }

        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime.getTime() - (1 * 60 * 60 * 1000));
        const ticketsToRemove = ticketOrders.filter(ticketOrder => ticketOrder.ticketUsage && ticketOrder.updatedAt < oneHourAgo);

        if (ticketsToRemove.length === 0) {
            return res.status(404).json({error: "No used tickets found"});
        }

        await TicketOrder.deleteMany({_id:{$in: ticketsToRemove.map(ticket => ticket._id)}});

        res.json({message:"Used tickets successfully removed"});
    } catch (error){
        console.error("Error:", error);
        res.status(711).json({error: "Internal Server Error"});
    }
});

module.exports = router;