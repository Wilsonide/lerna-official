import RegisterForm from "@/components/auth/register-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const params = await searchParams;

  return <RegisterForm inviteCode={params.invite ?? ""} />;
}
