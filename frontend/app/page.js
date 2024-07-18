"use client";

import DashBoard from "./components/dashboard";
import withAuth from "./hooks/withAuth";

function Home({ user }) {
  // const { loading, user } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/users/login");
  //   }
  // }, [loading, user, router]);

  // if (loading) {
  //   return (
  //     <>
  //       <SpinnerCustom />
  //     </>
  //   );
  // }

  return (
    <>
      <DashBoard user={user} />
    </>
  );
}

export default withAuth(Home);
