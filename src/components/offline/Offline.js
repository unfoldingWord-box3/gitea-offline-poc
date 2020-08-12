import React, { useState, useCallback, useContext } from 'react';
import {
  AuthenticationContextProvider,
  AuthenticationContext,
  RepositoryContextProvider,
  RepositoryContext,
  FileContextProvider,
  FileContext,
} from 'gitea-react-toolkit';

function Component({}) {
  const { state: authentication, component: authComponent } = useContext(AuthenticationContext);
  const { state: repository, component: repoComponent } = useContext(RepositoryContext);
  const { state: file, component: fileComponent } = useContext(FileContext);
  
  return (!authentication && authComponent) || 
  (!repository && repoComponent) || 
  fileComponent;
};

export default function Offline({}) {
  const [authentication, setAuthentication] = useState();
  const [repoFullname, setRepoFullname] = useState();
  const [repository, setRepository] = useState();
  const [filepath, setFilepath] = useState();

  const onRepository = useCallback((repository) => {
    if (repository && repository.full_name) setRepoFullname(repository.full_name);
    setRepository(repository);
  }, []);

  const config = {
    server: 'https://bg.door43.org',
    tokenid: 'OfflinePoC',
  }
  return (
    <AuthenticationContextProvider
      { ...{ authentication, onAuthentication: setAuthentication, config } }
    >
      <RepositoryContextProvider
        { ...{ 
          repoFullname,
          repository,
          onRepository,
          defaultOwner: (authentication && authentication.user.username)
        } }
      >
        <FileContextProvider
          { ...{
            filepath, onFilepath: setFilepath,
          } }
        >
          <Component />
        </FileContextProvider>
      </RepositoryContextProvider>
    </AuthenticationContextProvider>
  );
};
