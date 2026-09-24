import FormUpdateInfoUser from "@/src/features/auth/components/FormUpdateInfoUser";
import ChartBar from "@/src/features/gastos/components/ChartBar";
import { transactionService } from "@/src/features/transaction/services/serviceTransaction";
import { UserSession } from "@/src/lib/authServer";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await UserSession();
  if(!session?.user.id) redirect('/auth/signin');


  return (
    <section className='space-y-10'>
      <h1 className='text-4xl font-semibold text-center'>Cambiar Password</h1>
      <FormUpdateInfoUser />
    </section>
  )
}




// // app/(dashboard)/profile/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { 
//   User, 
//   Lock, 
//   Bell, 
//   Camera, 
//   CheckCircle2, 
//   AlertCircle, 
//   Loader2, 
//   Save, 
//   ShieldCheck 
// } from 'lucide-react';

// // --- SCHEMAS DE VALIDACIÓN CON ZOD ---

// const profileSchema = z.object({
//   name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
//   email: z.string().email('Ingresa un correo electrónico válido'),
//   phone: z.string().optional(),
//   bio: z.string().max(200, 'La biografía no puede superar los 200 caracteres').optional(),
// });

// const passwordSchema = z.object({
//   currentPassword: z.string().min(6, 'La contraseña actual debe tener al menos 6 caracteres'),
//   newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
//   confirmPassword: z.string().min(8, 'Confirma tu nueva contraseña'),
// }).refine((data) => data.newPassword === data.confirmPassword, {
//   message: 'Las contraseñas no coinciden',
//   path: ['confirmPassword'],
// });

// type ProfileFormValues = z.infer<typeof profileSchema>;
// type PasswordFormValues = z.infer<typeof passwordSchema>;

// export default function PerfilPage() {
//   const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
//   const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
//   const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  
//   // Feedback visual de estados
//   const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

//   // Formulario Información Personal
//   const {
//     register: registerProfile,
//     handleSubmit: handleSubmitProfile,
//     formState: { errors: profileErrors, isDirty: isProfileDirty },
//   } = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       name: 'Usuario Ejemplo',
//       email: 'usuario@ejemplo.com',
//       phone: '+52 477 123 4567',
//       bio: 'Desarrollador web apasionado por construir buenas aplicaciones.',
//     },
//   });

//   // Formulario Cambio de Contraseña
//   const {
//     register: registerPassword,
//     handleSubmit: handleSubmitPassword,
//     reset: resetPasswordForm,
//     formState: { errors: passwordErrors },
//   } = useForm<PasswordFormValues>({
//     resolver: zodResolver(passwordSchema),
//   });

//   // Handlers de envío
//   const onUpdateProfile = async (data: ProfileFormValues) => {
//     setIsSubmittingProfile(true);
//     setFeedback(null);
//     try {
//       // Simulación de llamada a Server Action o API
//       await new Promise((resolve) => setTimeout(resolve, 1200));
//       setFeedback({ type: 'success', message: 'Información de perfil actualizada correctamente.' });
//     } catch {
//       setFeedback({ type: 'error', message: 'Ocurrió un error al actualizar los datos.' });
//     } finally {
//       setIsSubmittingProfile(false);
//     }
//   };

//   const onUpdatePassword = async (data: PasswordFormValues) => {
//     setIsSubmittingPassword(true);
//     setFeedback(null);
//     try {
//       // Simulación de llamada a Server Action o API
//       await new Promise((resolve) => setTimeout(resolve, 1200));
//       resetPasswordForm();
//       setFeedback({ type: 'success', message: 'Contraseña actualizada con éxito.' });
//     } catch {
//       setFeedback({ type: 'error', message: 'Error al cambiar la contraseña. Verifica tus datos.' });
//     } finally {
//       setIsSubmittingPassword(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mi Perfil</h1>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           Administra tu información personal, contraseña y preferencias de la cuenta.
//         </p>
//       </div>

//       {/* MENSAJES DE ALERTA DE FEEDBACK */}
//       {feedback && (
//         <div
//           className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border ${
//             feedback.type === 'success'
//               ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
//               : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
//           }`}
//         >
//           {feedback.type === 'success' ? (
//             <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
//           ) : (
//             <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
//           )}
//           <span>{feedback.message}</span>
//         </div>
//       )}

//       {/* TARJETA PRINCIPAL DE PERFIL */}
//       <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        
//         {/* NAVEGACIÓN POR PESTAÑAS */}
//         <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 gap-6 overflow-x-auto">
//           <button
//             onClick={() => { setActiveTab('profile'); setFeedback(null); }}
//             className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
//               activeTab === 'profile'
//                 ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
//                 : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
//             }`}
//           >
//             <User className="w-4 h-4" />
//             Información Personal
//           </button>

//           <button
//             onClick={() => { setActiveTab('security'); setFeedback(null); }}
//             className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
//               activeTab === 'security'
//                 ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
//                 : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
//             }`}
//           >
//             <Lock className="w-4 h-4" />
//             Seguridad y Contraseña
//           </button>

//           <button
//             onClick={() => { setActiveTab('notifications'); setFeedback(null); }}
//             className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
//               activeTab === 'notifications'
//                 ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
//                 : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
//             }`}
//           >
//             <Bell className="w-4 h-4" />
//             Notificaciones
//           </button>
//         </div>

//         <div className="p-6 sm:p-8">
//           {/* TAB 1: INFORMACIÓN PERSONAL */}
//           {activeTab === 'profile' && (
//             <div className="space-y-8">
//               {/* AVATAR DE USUARIO */}
//               <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
//                 <div className="relative group">
//                   <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 font-bold text-3xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
//                     UE
//                   </div>
//                   <button 
//                     type="button"
//                     className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-transform active:scale-95"
//                     title="Cambiar foto de perfil"
//                   >
//                     <Camera className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="text-center sm:text-left space-y-1">
//                   <h2 className="font-bold text-lg text-slate-900 dark:text-white">Foto de Perfil</h2>
//                   <p className="text-xs text-slate-500 dark:text-slate-400">
//                     Soporta formatos JPG, PNG o GIF. Máximo 2MB.
//                   </p>
//                 </div>
//               </div>

//               {/* FORMULARIO DE DATOS */}
//               <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   {/* Nombre */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       Nombre Completo
//                     </label>
//                     <input
//                       type="text"
//                       {...registerProfile('name')}
//                       className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
//                     />
//                     {profileErrors.name && (
//                       <p className="text-xs text-red-500">{profileErrors.name.message}</p>
//                     )}
//                   </div>

//                   {/* Correo Electrónico */}
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       Correo Electrónico
//                     </label>
//                     <input
//                       type="email"
//                       {...registerProfile('email')}
//                       className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
//                     />
//                     {profileErrors.email && (
//                       <p className="text-xs text-red-500">{profileErrors.email.message}</p>
//                     )}
//                   </div>

//                   {/* Teléfono */}
//                   <div className="space-y-2 sm:col-span-2">
//                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       Teléfono
//                     </label>
//                     <input
//                       type="text"
//                       {...registerProfile('phone')}
//                       className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
//                     />
//                   </div>

//                   {/* Biografía */}
//                   <div className="space-y-2 sm:col-span-2">
//                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       Biografía / Nota corta
//                     </label>
//                     <textarea
//                       rows={3}
//                       {...registerProfile('bio')}
//                       className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all resize-none"
//                     />
//                     {profileErrors.bio && (
//                       <p className="text-xs text-red-500">{profileErrors.bio.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
//                   <button
//                     type="submit"
//                     disabled={isSubmittingProfile || !isProfileDirty}
//                     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
//                   >
//                     {isSubmittingProfile ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}
//                     Guardar Cambios
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* TAB 2: SEGURIDAD Y CONTRASEÑA */}
//           {activeTab === 'security' && (
//             <div className="max-w-2xl space-y-6">
//               <div>
//                 <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
//                   <ShieldCheck className="w-5 h-5 text-blue-600" />
//                   Cambiar Contraseña
//                 </h3>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//                   Asegúrate de utilizar una contraseña segura y única para proteger tu cuenta.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-5">
//                 {/* Contraseña Actual */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     Contraseña Actual
//                   </label>
//                   <input
//                     type="password"
//                     {...registerPassword('currentPassword')}
//                     className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
//                   />
//                   {passwordErrors.currentPassword && (
//                     <p className="text-xs text-red-500">{passwordErrors.currentPassword.message}</p>
//                   )}
//                 </div>

//                 {/* Nueva Contraseña */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     Nueva Contraseña
//                   </label>
//                   <input
//                     type="password"
//                     {...registerPassword('newPassword')}
//                     className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
//                   />
//                   {passwordErrors.newPassword && (
//                     <p className="text-xs text-red-500">{passwordErrors.newPassword.message}</p>
//                   )}
//                 </div>

//                 {/* Confirmar Contraseña */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     Confirmar Nueva Contraseña
//                   </label>
//                   <input
//                     type="password"
//                     {...registerPassword('confirmPassword')}
//                     className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
//                   />
//                   {passwordErrors.confirmPassword && (
//                     <p className="text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>
//                   )}
//                 </div>

//                 <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
//                   <button
//                     type="submit"
//                     disabled={isSubmittingPassword}
//                     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
//                   >
//                     {isSubmittingPassword ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Lock className="w-4 h-4" />
//                     )}
//                     Actualizar Contraseña
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* TAB 3: NOTIFICACIONES */}
//           {activeTab === 'notifications' && (
//             <div className="space-y-6 max-w-2xl">
//               <h3 className="text-base font-semibold text-slate-900 dark:text-white">
//                 Preferencias de Comunicación
//               </h3>

//               <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
//                 <div className="flex items-center justify-between pt-2">
//                   <div>
//                     <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
//                       Alertas de límite excedido
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       Recibe correos cuando pases el 80% o 100% de tus presupuestos.
//                     </p>
//                   </div>
//                   <input
//                     type="checkbox"
//                     defaultChecked
//                     className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="flex items-center justify-between pt-4">
//                   <div>
//                     <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
//                       Resumen mensual
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       Un reporte en tu correo al finalizar cada mes con tu balance.
//                     </p>
//                   </div>
//                   <input
//                     type="checkbox"
//                     defaultChecked
//                     className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }