"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { COLORS, FONTS } from "@/lib/theme";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowModal(true);
    }
  }, [status]);

  const handleLoginRedirect = async () => {
    setShowModal(false);
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") return null;

  return (
    <>
      {children}


      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.GRADIENT_1}, ${COLORS.GRADIENT_2}, ${COLORS.GRADIENT_3})`,
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl p-8 text-center"
            style={{
              backgroundColor: "#ffffff",
              fontFamily: FONTS.SANS,
            }}
          >
            {/* Title */}
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ color: COLORS.PRIMARY }}
            >
              Session Expired
            </h2>

            {/* Divider */}
            <div
              className="w-[70%] h-1 mx-auto mb-4 rounded-full"
              style={{ backgroundColor: COLORS.SECONDARY }}
            />

            {/* Description */}
            <p className="text-sm mb-6" style={{ color: COLORS.TEXT_GRAY }}>
              For your security, your session has expired.
              <br />
              Please login again to continue your health journey.
            </p>

            {/* Button */}
            <button
              onClick={handleLoginRedirect}
              className="w-full py-3 rounded-xl font-medium transition-all duration-300"
              style={{
                backgroundColor: COLORS.BUTTON_BG,
                color: COLORS.SECONDARY,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.PRIMARY)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.BUTTON_BG)
              }
            >
              Login Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}
