"use client";

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import FormRow from '../components/ui/FormRow';
import Checkbox from '../components/ui/Checkbox';
import Divider from '../components/ui/Divider';
import GoogleButton from '../components/ui/GoogleButton';
import AuthLayout from '../components/layout/AuthLayout';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { PASSWORD_RULES } from '../lib/validation/password';
import styles from './register.module.css';

export default function RegisterPage() {
  const {
    formData,
    isAgreed,
    isSubmitting,
    errorMessage,
    showPassword,
    showConfirmPassword,
    passwordErrors,
    passwordsMatch,
    handleChange,
    handleAgreedChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,

    stage,
    codeDigits,
    codeInputRefs,
    isVerifying,
    verifyError,
    isResending,
    resendMessage,
    resendCooldown,
    handleCodeChange,
    handleCodeKeyDown,
    handleVerifySubmit,
    handleResendCode,
    backToForm,
  } = useRegisterForm();

  return (
    <AuthLayout mode="register">
      <div className={styles.windowDots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>

      <div className={styles.stageWrapper}>
        <AnimatePresence mode="wait" initial={false}>
          {stage === 'verify' ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className={styles.title}>Check your email</h1>
              <p className={styles.subtitle}>
                We sent a 6-digit code to <strong>{formData.email}</strong>. Enter it below to
                activate your account.
              </p>

              <form className={styles.form} onSubmit={handleVerifySubmit}>
                {(verifyError || resendMessage) && (
                  <div className={styles.floatingNotices}>
                    {verifyError && (
                      <div className={`${styles.noticeCard} ${styles.mismatchCard}`} role="alert">
                        <p className={styles.fieldError}>{verifyError}</p>
                      </div>
                    )}
                    {resendMessage && (
                      <div className={styles.noticeCard} role="status">
                        <p className={styles.resendMessage}>{resendMessage}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.codeInputRow}>
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        codeInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      className={styles.codeBox}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  variant="solid"
                  className={styles.submitButton}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </Button>

                <p className={styles.footer}>
                  Didn&apos;t get a code?{' '}
                  <button
                    type="button"
                    className={styles.resendLink}
                    onClick={handleResendCode}
                    disabled={isResending || resendCooldown > 0}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : isResending
                      ? 'Sending...'
                      : 'Resend code'}
                  </button>
                </p>

                <p className={styles.footer}>
                  <button type="button" className={styles.resendLink} onClick={backToForm}>
                    Back to sign up
                  </button>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className={styles.title}>Create an account OK</h1>
              <p className={styles.subtitle}>
                Let&apos;s get started with your custom profile setups
              </p>

              <form className={styles.form} onSubmit={handleSubmit}>
                {(errorMessage ||
                  (formData.password.length > 0 && passwordErrors.length > 0) ||
                  !passwordsMatch) && (
                  <div className={styles.floatingNotices}>
                    {errorMessage && (
                      <div className={`${styles.noticeCard} ${styles.mismatchCard}`} role="alert">
                        <p className={styles.fieldError}>{errorMessage}</p>
                      </div>
                    )}

                    {formData.password.length > 0 && passwordErrors.length > 0 && (
                      <div className={styles.noticeCard} role="status">
                        <p className={styles.passwordRulesTitle}>Password must contain</p>
                        <ul className={styles.passwordRules}>
                          {PASSWORD_RULES.map((rule) => {
                            const met = rule.test(formData.password);
                            return (
                              <li
                                key={rule.label}
                                className={met ? styles.ruleMet : styles.ruleUnmet}
                              >
                                {rule.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {!passwordsMatch && (
                      <div className={`${styles.noticeCard} ${styles.mismatchCard}`} role="alert">
                        <p className={styles.fieldError}>Passwords do not match.</p>
                      </div>
                    )}
                  </div>
                )}

                <FormRow>
                  <FormInput
                    id="firstName"
                    type="text"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    id="lastName"
                    type="text"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </FormRow>

                <FormInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <div className={styles.passwordField}>
                  <FormInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordBtn}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className={styles.passwordField}>
                  <FormInput
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordBtn}
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Checkbox
                  id="termsAgreement"
                  checked={isAgreed}
                  onChange={handleAgreedChange}
                >
                  By clicking to sign up, you agree to our{' '}
                  <Link href="/terms" className={styles.link}>Terms of Service</Link> and{' '}
                  <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
                </Checkbox>

                <Button
                  type="submit"
                  variant="solid"
                  className={styles.submitButton}
                  disabled={!isAgreed || isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>

                <Divider />

                <GoogleButton
                  label="Sign up with Google"
                  onClick={() => alert('Google authentication triggered')}
                />
              </form>

              <p className={styles.footer}>
                Already have an account?{' '}
                <Link href="/login" className={styles.link}>
                  Sign In
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}