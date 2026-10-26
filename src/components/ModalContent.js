import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { networkSlice } from "../reducer/NetworkSlice";
import { Avatar } from "./Avatar";
import { fetchProfileData } from "../async/fetchProfileData";

import {
  Overlay,
  Dialog,
  CloseButton,
  Profile,
  Username,
  Bio,
  Location,
  ProfileLink,
} from "../styles/styles";

function ModalContent({ node }) {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.network.profiles[node.id]);
  const error = useSelector((s) => s.network.profileError[node.id]);
  const closeRef = useRef(null);
  const close = () => dispatch(closeModal());
  const { closeModal } = networkSlice.actions;

  // fetchProfile's `condition` skips the request if the profile is already cached.
  useEffect(() => {
    dispatch(fetchProfileData(node.id));
  }, [dispatch, node.id]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && dispatch(closeModal());
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, closeModal]);

  return (
    <Overlay onClick={close}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={`${node.id} GitHub profile`}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton ref={closeRef} onClick={close} aria-label="Close">
          ×
        </CloseButton>
        <Profile>
          <Avatar src={node.avatar_url} name={node.id} />
          <Username>@{node.id}</Username>
          {profile ? (
            <>
              <Bio>{profile.bio || "No bio provided."}</Bio>
              <Location>{profile.location || "No location listed."}</Location>
            </>
          ) : error ? (
            <Bio $error>{error}</Bio>
          ) : (
            <Location>Loading profile…</Location>
          )}
          <ProfileLink href={node.html_url} target="_blank" rel="noreferrer">
            View GitHub profile
          </ProfileLink>
        </Profile>
      </Dialog>
    </Overlay>
  );
}

export default ModalContent;
