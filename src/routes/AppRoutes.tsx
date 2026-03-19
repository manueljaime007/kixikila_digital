import { Routes, Route, Navigate } from "react-router-dom";

import { SplashPage } from "../pages/SplashPage";
import { TermsPage } from "../pages/TermsPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import {
  DepositPage,
  WithdrawPage,
  CreateGroupPage,
} from "../pages/ActionPages";

import { Dashboard } from "../components/Dashboard";
import { Groups } from "../components/Groups";
import { Corporate } from "../components/Corporate";
import { Notes } from "../components/Notes";
import { Voting } from "../components/Voting";
import { Settings } from "../components/Settings";

import { PrivateRoute } from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

// grupos mock enquanto não há rota na BD para isso
import { Frequency, GroupType } from "../types";

const MOCK_GROUPS = [
  {
    id: "1",
    name: "Kixikila dos Manos",
    contribution: 5000,
    frequency: Frequency.DAILY,
    totalMembers: 10,
    currentMembers: 8,
    startDate: "2024-03-10",
    description: "Grupo focado em poupança rápida diária.",
    type: GroupType.NORMAL,
    verified: true,
    status: "Aberto" as const,
  },
  {
    id: "2",
    name: "Mambo da Banda",
    contribution: 20000,
    frequency: Frequency.WEEKLY,
    totalMembers: 20,
    currentMembers: 18,
    startDate: "2024-04-01",
    description: "Kixikila de alto valor para capital de giro.",
    type: GroupType.NORMAL,
    verified: true,
    status: "Aberto" as const,
  },
  {
    id: "3",
    name: "Jovens do Futuro",
    contribution: 5000,
    frequency: Frequency.MONTHLY,
    totalMembers: 10,
    currentMembers: 5,
    startDate: "2024-01-15",
    description: "Preparação para as festas de fim de ano.",
    type: GroupType.NORMAL,
    status: "Aberto" as const,
  },
  {
    id: "4",
    name: "Kixikila dos Cotas",
    contribution: 50000,
    frequency: Frequency.MONTHLY,
    totalMembers: 12,
    currentMembers: 12,
    startDate: "2024-06-01",
    description: "Grupo focado em grandes investimentos.",
    type: GroupType.NORMAL,
    verified: true,
    status: "Cheio" as const,
  },
];

const PrivateDashboard = () => {
  const { user, logout } = useAuth();
  return <Dashboard user={user!} setScreen={() => {}} />;
};

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* públicas */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />

      {/* privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <PrivateDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <PrivateRoute>
            <Groups
              groups={MOCK_GROUPS}
              onJoin={() => {}}
              onCreate={() => {}}
            />
          </PrivateRoute>
        }
      />
      <Route
        path="/corporate"
        element={
          <PrivateRoute>
            <Corporate setScreen={() => {}} />
          </PrivateRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <PrivateRoute>
            <Notes />
          </PrivateRoute>
        }
      />
      <Route
        path="/voting"
        element={
          <PrivateRoute>
            <Voting onBack={() => {}} />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/deposit"
        element={
          <PrivateRoute>
            <DepositPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <PrivateRoute>
            <WithdrawPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-group"
        element={
          <PrivateRoute>
            <CreateGroupPage />
          </PrivateRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// wrapper para o Settings ter acesso ao useAuth
const SettingsWrapper = () => {
  const { user, logout } = useAuth();
  return (
    <Settings
      user={user!}
      onLogout={logout}
      onBack={() => window.history.back()}
    />
  );
};
