"use client";
import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Card = {
  id: number;
  title: string;
};

const initialCards: Card[] = [
  { id: 1, title: "Math Class" },
  { id: 2, title: "Science Project" },
  { id: 3, title: "English Essay" },
];

type TimetableSlot = {
  id: number;
  card?: Card;
};

const initialSlots: TimetableSlot[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];

const DraggableCard: React.FC<{ card: Card }> = ({ card }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { ...card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={drag}
      className={`p-3 m-2 bg-primary text-white rounded shadow cursor-move transition-opacity ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      {card.title}
    </div>
  );
};

const TimetableSlotComponent: React.FC<{
  slot: TimetableSlot;
  onDropCard: (slotId: number, card: Card) => void;
}> = ({ slot, onDropCard }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "CARD",
    drop: (item: Card) => onDropCard(slot.id, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`h-20 m-2 rounded border-2 border-dashed flex items-center justify-center transition
        ${isOver && canDrop ? "border-primary bg-highlight" : "border-gray-300 bg-white"}
      `}
    >
      {slot.card ? (
        <div className="p-2 bg-primary text-white rounded">{slot.card.title}</div>
      ) : (
        <span className="text-gray-400">Drop card here</span>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [slots, setSlots] = useState<TimetableSlot[]>(initialSlots);

  const handleDropCard = (slotId: number, card: Card) => {
    // Remove card from sidebar
    setCards((prev) => prev.filter((c) => c.id !== card.id));
    // Place card in slot
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, card } : slot
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full z-40 transition-transform duration-300 bg-card shadow-lg ${
          collapsed ? "translate-x-full" : "translate-x-0"
        } w-72`}
      >
        <button
          className="absolute left-0 top-5 -translate-x-full bg-primary text-white px-2 py-1 rounded-l"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "←" : "→"}
        </button>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Sidebar</h2>
          <div>
            {cards.length === 0 && (
              <div className="text-gray-400">No more cards</div>
            )}
            {cards.map((card) => (
              <DraggableCard card={card} key={card.id} />
            ))}
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="ml-4 mr-80 mt-10">
        <h2 className="text-2xl font-bold mb-4">Timetable</h2>
        <div className="grid grid-cols-1 gap-2">
          {slots.map((slot) => (
            <TimetableSlotComponent
              key={slot.id}
              slot={slot}
              onDropCard={handleDropCard}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Sidebar;
