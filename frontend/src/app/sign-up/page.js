import { SignUp } from "@clerk/nextjs";
import styles from "./auth.module.css";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authHeader}>
        <Link href="/">
          <img
            src="/medium-logo.png"
            alt="Medium Logo"
            className={styles.logo}
          />
        </Link>
      </div>
      <div className={styles.authContent}>
        <SignUp
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
