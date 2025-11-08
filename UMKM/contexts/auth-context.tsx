import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const USERS_STORAGE_KEY = '@sapa_umkm_users';
const SESSION_STORAGE_KEY = '@sapa_umkm_session';

export type UMKMProfile = {
  id: string;
  businessName: string;
  ownerName: string;
  businessCategory: string;
  phoneNumber: string;
  phoneDigits: string;
  email: string;
  businessAddress: string;
  description: string;
  products: string;
  registeredAt: string;
  password: string;
};

type RegisterPayload = Omit<UMKMProfile, 'id' | 'registeredAt' | 'phoneDigits'>;

type AuthContextValue = {
  currentUser: UMKMProfile | null;
  isInitialized: boolean;
  registerUMKM: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  loginUMKM: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutUMKM: () => Promise<void>;
  updateUMKMProfile: (
    updates: Partial<Omit<UMKMProfile, 'id' | 'registeredAt' | 'phoneDigits' | 'password'>> & {
      password?: string;
    }
  ) => Promise<{ success: boolean; message: string }>;
  allUMKM: UMKMProfile[];
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [allUMKM, setAllUMKM] = useState<UMKMProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UMKMProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [storedUsers, storedSession] = await Promise.all([
          AsyncStorage.getItem(USERS_STORAGE_KEY),
          AsyncStorage.getItem(SESSION_STORAGE_KEY),
        ]);

        if (storedUsers) {
          const parsedUsers: UMKMProfile[] = JSON.parse(storedUsers);
          setAllUMKM(parsedUsers);
          if (storedSession) {
            const active = parsedUsers.find((user) => user.id === storedSession);
            if (active) {
              setCurrentUser(active);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load UMKM session', error);
      } finally {
        setIsInitialized(true);
      }
    }

    void bootstrap();
  }, []);

  const registerUMKM = async (payload: RegisterPayload) => {
    const email = normalizeEmail(payload.email);
    const phoneDigits = normalizePhone(payload.phoneNumber);

    if (!email || !payload.password.trim()) {
      return { success: false, message: 'Email dan kata sandi wajib diisi.' };
    }

    const emailExists = allUMKM.some((user) => user.email === email);
    if (emailExists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' };
    }

    const phoneExists = phoneDigits
      ? allUMKM.some((user) => user.phoneDigits === phoneDigits)
      : false;
    if (phoneExists) {
      return { success: false, message: 'Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.' };
    }

    const newUser: UMKMProfile = {
      id: generateId(),
      businessName: payload.businessName.trim(),
      ownerName: payload.ownerName.trim(),
      businessCategory: payload.businessCategory.trim(),
      phoneNumber: payload.phoneNumber.trim(),
      phoneDigits,
      email,
      businessAddress: payload.businessAddress.trim(),
      description: payload.description.trim(),
      products: payload.products.trim(),
      registeredAt: new Date().toISOString(),
      password: payload.password,
    };

    const updatedUsers = [...allUMKM, newUser];
    setAllUMKM(updatedUsers);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    return { success: true, message: 'Registrasi berhasil. Silakan login untuk melanjutkan.' };
  };

  const loginUMKM = async (identifier: string, password: string) => {
    const normalizedIdentifier = normalizeEmail(identifier);
    const digitsIdentifier = normalizePhone(identifier);

    const user = allUMKM.find((record) => {
      if (record.email === normalizedIdentifier) {
        return true;
      }
      if (digitsIdentifier) {
        return record.phoneDigits === digitsIdentifier;
      }
      return false;
    });

    if (!user) {
      return { success: false, message: 'Akun tidak ditemukan. Periksa kembali email atau nomor telepon.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Kata sandi tidak sesuai.' };
    }

    setCurrentUser(user);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, user.id);
    return { success: true, message: 'Login berhasil.' };
  };

  const logoutUMKM = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const updateUMKMProfile = useCallback(
    async (
      updates: Partial<Omit<UMKMProfile, 'id' | 'registeredAt' | 'phoneDigits' | 'password'>> & {
        password?: string;
      }
    ) => {
      if (!currentUser) {
        return { success: false, message: 'Tidak ada sesi pengguna aktif.' };
      }

      const trimmedOwnerName =
        updates.ownerName !== undefined ? updates.ownerName.trim() : currentUser.ownerName;
      const trimmedBusinessName =
        updates.businessName !== undefined ? updates.businessName.trim() : currentUser.businessName;
      const trimmedBusinessCategory =
        updates.businessCategory !== undefined ? updates.businessCategory.trim() : currentUser.businessCategory;
      const trimmedBusinessAddress =
        updates.businessAddress !== undefined ? updates.businessAddress.trim() : currentUser.businessAddress;
      const trimmedDescription =
        updates.description !== undefined ? updates.description.trim() : currentUser.description;
      const trimmedProducts =
        updates.products !== undefined ? updates.products.trim() : currentUser.products;

      const nextEmail = updates.email !== undefined ? normalizeEmail(updates.email) : currentUser.email;
      if (!nextEmail) {
        return { success: false, message: 'Email tidak boleh kosong.' };
      }

      const emailUsedByOthers = allUMKM.some(
        (user) => user.id !== currentUser.id && user.email === nextEmail
      );
      if (emailUsedByOthers) {
        return { success: false, message: 'Email sudah digunakan oleh akun lain.' };
      }

      const nextPhoneNumber =
        updates.phoneNumber !== undefined ? updates.phoneNumber.trim() : currentUser.phoneNumber;
      if (!nextPhoneNumber) {
        return { success: false, message: 'Nomor telepon tidak boleh kosong.' };
      }
      const nextPhoneDigits = normalizePhone(nextPhoneNumber);
      if (nextPhoneDigits) {
        const phoneUsedByOthers = allUMKM.some(
          (user) => user.id !== currentUser.id && user.phoneDigits === nextPhoneDigits
        );
        if (phoneUsedByOthers) {
          return { success: false, message: 'Nomor telepon sudah digunakan oleh akun lain.' };
        }
      }

      const trimmedPassword = updates.password?.trim();
      if (trimmedPassword && trimmedPassword.length < 6) {
        return { success: false, message: 'Kata sandi minimal 6 karakter.' };
      }

      const updatedUser: UMKMProfile = {
        ...currentUser,
        businessName: trimmedBusinessName,
        ownerName: trimmedOwnerName,
        businessCategory: trimmedBusinessCategory,
        phoneNumber: nextPhoneNumber,
        phoneDigits: nextPhoneDigits,
        email: nextEmail,
        businessAddress: trimmedBusinessAddress,
        description: trimmedDescription,
        products: trimmedProducts,
        password: trimmedPassword ? trimmedPassword : currentUser.password,
      };

      const updatedUsers = allUMKM.map((user) => (user.id === currentUser.id ? updatedUser : user));
      setAllUMKM(updatedUsers);
      setCurrentUser(updatedUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      return { success: true, message: 'Pengaturan akun berhasil diperbarui.' };
    },
    [allUMKM, currentUser]
  );

  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    isInitialized,
    registerUMKM,
    loginUMKM,
    logoutUMKM,
    updateUMKMProfile,
    allUMKM,
  }), [currentUser, isInitialized, allUMKM, updateUMKMProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}

