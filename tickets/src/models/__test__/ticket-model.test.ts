import { Tickets } from "../../models";

it("implements optimistic concurrency control", async () => {
  // create an instance of the ticket
  const ticket = Tickets.build({
    price: 20,
    title: "Ye concert",
    userId: "1234",
  });

  // save the ticket to the database

  await ticket.save();

  // fetch the ticket twice
  const ticket1 = await Tickets.findById(ticket.id);
  const ticket2 = await Tickets.findById(ticket.id);
  // make two separate changes to the tickets we fetched
  ticket1!.set({ price: 10 });
  ticket2!.set({ price: 15 });
  // save the first fetched ticket
  await ticket1!.save();
  // save the second fetched ticket and expect an error
  try {
    await ticket2!.save();
  } catch (error) {
    return;
  }
});
