import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#F4F1FB" }}>
            <SignUp 
                appearance={{
                    variables: {
                        colorPrimary: "#6C4FBF",
                        colorBackground: "#FFFFFF",
                        colorInputBackground: "#EDE8F8",
                        colorInputText: "#A89EC4",
                        borderColor: "#DDD6F0",
                        borderRadius: "15px",
                        colorText: "#1E1A2E",
                        fontFamily: "var(--font-dm-sans)",
                    },
                }}
            />
        </main>
    );
}