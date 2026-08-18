export interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  topic: string;
  status: "active" | "resolved" | "pending";
  messageCount: number;
}

const STATUS_LABELS: Record<Conversation["status"], string> = {
  active: "Activa",
  resolved: "Resuelta",
  pending: "Pendiente",
};

const STATUS_CLASS: Record<Conversation["status"], string> = {
  active: "badge-green",
  resolved: "badge-yellow",
  pending: "badge-red",
};

interface Props {
  conversations: Conversation[];
}

export default function ConversationList({ conversations }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-navy-500 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Conversaciones recientes</h2>
        <span className="text-xs text-slate-500">{conversations.length} total</span>
      </div>
      <div className="divide-y divide-navy-500">
        {conversations.map((c) => (
          <div key={c.id} className="px-5 py-4 flex items-start gap-3 hover:bg-navy-600/40 transition-colors">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-navy-500 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white truncate">{c.name}</p>
                <span className="text-[10px] text-slate-500 flex-shrink-0">{c.time}</span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={STATUS_CLASS[c.status]}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-green-400" : c.status === "resolved" ? "bg-yellow-400" : "bg-red-400"}`} />
                  {STATUS_LABELS[c.status]}
                </span>
                <span className="text-[10px] text-slate-500 bg-navy-500 px-2 py-0.5 rounded-full">{c.topic}</span>
                <span className="text-[10px] text-slate-500 ml-auto">{c.messageCount} msgs</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
