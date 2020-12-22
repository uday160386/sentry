import React from 'react';
import styled from '@emotion/styled';

import EmptyStateWarning from 'app/components/emptyStateWarning';
import Pagination from 'app/components/pagination';
import {Panel} from 'app/components/panels';
import QueryCount from 'app/components/queryCount';
import {t} from 'app/locale';
import {Fingerprint} from 'app/stores/groupingStore';
import {Project} from 'app/types';

import MergedItem from './mergedItem';
import MergedToolbar from './mergedToolbar';

type Props = {
  onUnmerge: Function;
  onToggleCollapse: Function;
  fingerprints?: Fingerprint[];
  pageLinks?: string;
  orgId: string;
  project: Project;
};

class MergedList extends React.Component<Props> {
  renderEmpty = () => (
    <EmptyStateWarning>
      <p>{t("There doesn't seem to be any hashes for this issue.")}</p>
    </EmptyStateWarning>
  );

  render() {
    const {
      fingerprints = [],
      pageLinks,
      onToggleCollapse,
      onUnmerge,
      orgId,
      project,
    } = this.props;
    const fingerprintsWithLatestEvent = fingerprints.filter(
      ({latestEvent}) => !!latestEvent
    );
    const hasResults = fingerprintsWithLatestEvent.length > 0;

    if (!hasResults) {
      return <Panel>{this.renderEmpty()}</Panel>;
    }

    return (
      <div>
        <h2>
          <span>{t('Merged fingerprints with latest event')}</span>{' '}
          <QueryCount count={fingerprintsWithLatestEvent.length} />
        </h2>

        <MergedToolbar
          onToggleCollapse={onToggleCollapse}
          onUnmerge={onUnmerge}
          orgId={orgId}
          project={project}
        />

        <MergedItems>
          {fingerprintsWithLatestEvent.map(({id, latestEvent}) => (
            <MergedItem
              key={id}
              orgId={orgId}
              projectId={project.slug}
              disabled={fingerprintsWithLatestEvent.length === 1}
              event={latestEvent}
              fingerprint={id}
            />
          ))}
        </MergedItems>

        <Pagination pageLinks={pageLinks} />
      </div>
    );
  }
}

export default MergedList;

const MergedItems = styled('div')`
  border: 1px solid ${p => p.theme.border};
  border-top: none;
`;
