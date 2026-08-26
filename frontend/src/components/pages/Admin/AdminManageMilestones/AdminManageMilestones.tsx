import { faAdd, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type MilestoneFilterField,
  type MilestoneSortField,
  milestoneFilterFields,
  milestoneSortFields,
} from '../../../../hooks/useMilestonesFilterSort'
import { useAdminDeleteMilestones } from '../../../../services/milestones/admin/useAdminDeleteMilestones'
import { useAdminGetAllMilestones } from '../../../../services/milestones/admin/useAdminGetAllMilestones'
import type { AdminMilestoneDetails } from '../../../../services/milestones/types/milestoneTypes'
import { Button } from '../../../atoms/Button/Button'
import { DashBorder } from '../../../atoms/DashBorder/DashBorder'
import { FilterForm } from '../../../form/FilterForm/FilterForm'
import { SortForm, type SortDirection } from '../../../form/SortForm/SortForm'
import { MilestoneCard } from '../../../molecules/MilestoneCard/MilestoneCard'
import { Modal } from '../../../molecules/Modal/Modal'

let filterTimeout: number

export const AdminManageMilestones = () => {
  const [filterField, setFilterField] =
    useState<MilestoneFilterField>('projectName')
  const [filterText, setFilterText] = useState('')
  const [debouncedFilterText, setDebouncedFilterText] = useState('')
  const [sortField, setSortField] = useState<MilestoneSortField>('createdAt')
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('descending')

  useEffect(() => {
    window.clearTimeout(filterTimeout)
    filterTimeout = window.setTimeout(
      () => setDebouncedFilterText(filterText),
      300,
    )

    return () => window.clearTimeout(filterTimeout)
  }, [filterText])

  const {
    data: milestones,
    isPending,
    isError,
  } = useAdminGetAllMilestones({
    filterField,
    filterText: debouncedFilterText,
    sortField,
    sortDirection,
  })
  const visibleMilestones = milestones ?? []
  const hasFilterText = filterText.trim().length > 0

  const [selectedMilestones, setSelectedMilestones] = useState<
    Map<number, AdminMilestoneDetails>
  >(new Map())
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMilestones = useAdminDeleteMilestones()

  const setMilestoneSelected = (
    details: AdminMilestoneDetails,
    selected: boolean,
  ) => {
    setSelectedMilestones((current) => {
      const updated = new Map(current)
      const milestoneId = details.milestone.milestoneId
      if (selected) updated.set(milestoneId, details)
      else updated.delete(milestoneId)
      return updated
    })
  }

  const confirmDelete = () => {
    deleteMilestones.mutate([...selectedMilestones.keys()], {
      onSuccess: () => {
        setSelectedMilestones(new Map())
        setIsDeleteModalOpen(false)
      },
    })
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Manage Milestones</h1>
          <h4>Add, Update or Delete Milestones</h4>
        </div>
        <div className="flex grow flex-col justify-end gap-2 md:flex-row">
          {selectedMilestones.size > 0 && (
            <div>
              <Button
                variant="tertiary"
                onClick={() => setSelectedMilestones(new Map())}
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                Reset
              </Button>
            </div>
          )}
          <div>
            <Button
              variant="secondary"
              disabled={selectedMilestones.size === 0}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
              {selectedMilestones.size === 0
                ? 'Delete Milestones'
                : `Delete ${selectedMilestones.size} Milestones`}
            </Button>
          </div>
          <Link to="add">
            <Button variant="secondary">
              <FontAwesomeIcon icon={faAdd} />
              Add Milestone
            </Button>
          </Link>
        </div>
      </div>

      <FilterForm
        filterFields={milestoneFilterFields}
        filterField={filterField}
        filterText={filterText}
        onFilterFieldChange={(field) =>
          setFilterField(field as MilestoneFilterField)
        }
        onFilterTextChange={setFilterText}
        placeholder="Enter text to filter milestones"
      />

      <DashBorder>
        <span className="text-2xl font-bold">
          {visibleMilestones.length === 1 ? 'Milestone' : 'Milestones'}:{' '}
          {visibleMilestones.length}
        </span>
      </DashBorder>

      {!isPending && !isError && visibleMilestones.length > 0 && (
        <SortForm
          sortFields={milestoneSortFields}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={(field) =>
            setSortField(field as MilestoneSortField)
          }
          onSortDirectionChange={setSortDirection}
        />
      )}

      {isPending && <p role="status">Loading milestones...</p>}

      {isError && (
        <p role="alert" className="text-rose-500">
          Unable to load milestones. Please try again.
        </p>
      )}

      {!isPending && !isError && milestones?.length === 0 && !hasFilterText && (
        <p>No milestones have been added yet.</p>
      )}

      {!isPending &&
        !isError &&
        milestones &&
        (milestones.length > 0 || hasFilterText) &&
        visibleMilestones.length === 0 && (
          <p>No milestones match your search.</p>
        )}

      {!isPending && !isError && visibleMilestones.length > 0 && (
        <div className="flex flex-col gap-4">
          {visibleMilestones.map((details) => (
            <MilestoneCard
              details={details}
              key={details.milestone.milestoneId}
              selected={selectedMilestones.has(details.milestone.milestoneId)}
              onSelectedChange={(selected) =>
                setMilestoneSelected(details, selected)
              }
              editPath={`/admin/milestones/edit/${details.milestone.milestoneId}`}
            />
          ))}
        </div>
      )}

      {isDeleteModalOpen && (
        <Modal
          headerText="Delete Milestones?"
          closeModal={() => setIsDeleteModalOpen(false)}
          closeDisabled={deleteMilestones.isPending}
          firstButton={{
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            disabled: deleteMilestones.isPending,
          }}
          secondButton={{
            label: deleteMilestones.isPending
              ? 'Deleting...'
              : 'Delete Milestones',
            onClick: confirmDelete,
            disabled: deleteMilestones.isPending,
          }}
        >
          <p className="mt-2">
            Are you sure you want to delete the following milestones?
          </p>
          <ul className="my-4 list-disc space-y-1 pl-6">
            {[...selectedMilestones.values()].map(
              ({ milestone, projectName }) => (
                <li key={milestone.milestoneId}>
                  {projectName}: {milestone.note}
                </li>
              ),
            )}
          </ul>
          {deleteMilestones.isError && (
            <p role="alert" className="mb-4 text-rose-500">
              Unable to delete the selected milestones. Please try again.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}
