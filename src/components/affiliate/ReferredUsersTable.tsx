import { Users, Search, ArrowUpDown } from "lucide-react";
import { ReferredUserData } from "../../types/affiliate.types";

interface Props {
  users: ReferredUserData[];
  loading: boolean;
  settings: any;
}

export function ReferredUsersTable({ users, loading, settings }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(settings?.language || 'pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(settings?.language || 'pt-BR', {
      style: 'currency', currency: settings?.currency || 'USD'
    }).format(val);
  };

  if (loading) {
    return (
      <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-4 h-full">
        <div className="h-8 w-48 animate-pulse bg-white/5 rounded-lg mb-6" />
        {[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse bg-white/5 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <section className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 h-full overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Seus Convidados</div>
          <h3 className="text-2xl font-black text-white">Rede Ativa</h3>
        </div>
        <button className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
          Ver Todos
        </button>
      </div>

      {users.length === 0 ? (
        <div className="py-12 text-center text-slate-500 flex flex-col items-center">
          <Users size={48} className="mb-4 text-slate-700" />
          <p>Nenhuma indicação registada até ao momento.</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1 pb-2">
          <table className="w-full text-left text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <th className="pb-4">Usuário</th>
                <th className="pb-4">Plano</th>
                <th className="pb-4 text-center">Status</th>
                <th className="pb-4 text-right">Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.04] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-4 font-medium">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full border border-white/10 shadow-lg shadow-black/20" referrerPolicy="no-referrer" />
                      <span className="text-white text-xs">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-400 text-xs font-bold">
                    {user.plan}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      user.status === 'active'
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 text-right font-black text-white text-sm">
                    {formatCurrency(user.revenue_generated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
