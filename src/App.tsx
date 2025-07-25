// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import { AuthProvider } from "@/contexts/AuthContext";
// // import ProtectedRoute from "@/components/ProtectedRoute";
// // import Layout from "@/components/Layout";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Dashboard from "./pages/Dashboard";
// // import CreateCampaign from "./pages/CreateCampaign";
// // import NotFound from "./pages/NotFound";

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <AuthProvider>
// //         <Toaster />
// //         <Sonner />
// //         <BrowserRouter>
// //           <Routes>
// //             {/* Public Routes */}
// //             <Route path="/login" element={<Login />} />
// //             <Route path="/register" element={<Register />} />
            
// //             {/* Protected Routes */}
// //             <Route path="/" element={
// //               <ProtectedRoute>
// //                 <Layout />
// //               </ProtectedRoute>
// //             }>
// //               <Route index element={<Navigate to="/dashboard" replace />} />
// //               <Route path="dashboard" element={<Dashboard />} />
// //               <Route path="campaigns/new" element={<CreateCampaign />} />
// //             </Route>
            
// //             {/* Catch-all route */}
// //             <Route path="*" element={<NotFound />} />
// //           </Routes>
// //         </BrowserRouter>
// //       </AuthProvider>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from '@/contexts/AuthContext';
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';
// import CreateCampaign from '@/pages/CreateCampaign';
// import Dashboard from '@/pages/Dashboard';
// import StartCampaign from '@/pages/StartCampaign';
// import NotFound from '@/pages/NotFound';
// import ProtectedRoute from '@/components/ProtectedRoute';

// const App = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/create-campaign"
//             element={
//               <ProtectedRoute>
//                 <CreateCampaign />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/campaigns/:campaignId/start"
//             element={
//               <ProtectedRoute>
//                 <StartCampaign />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/campaigns/:id" element={<div>Campaign Detail Page</div>} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import CreateCampaign from '@/pages/CreateCampaign';
import Dashboard from '@/pages/Dashboard';
import StartCampaign from '@/pages/StartCampaign';
import CampaignDetails from '@/pages/CampaignDetails';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/create-campaign"
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/:campaignId/start"
            element={
              <ProtectedRoute>
                <StartCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/:campaignId"
            element={
              <ProtectedRoute>
                <CampaignDetails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;