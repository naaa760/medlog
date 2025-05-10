import { SignIn } from "@clerk/nextjs";
import styles from "./auth.module.css";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authHeader}>
        <div className="auth-logo">
          <Link href="/">
            <img src="/fl.png" alt="Medium" className="h-12 w-auto mb-8" />
          </Link>
        </div>
      </div>
      <div className={styles.authContent}>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: styles.primaryButton,
              footerAction: styles.footerAction,
            },
          }}
          redirectUrl="/feed"
        />
      </div>
    </div>
  );
}
