import { useAdminAddPattern } from '../../../../services/admin/useAdminAddPattern'
import { PatternForm } from '../../Patterns/PatternForm'

export const AdminAddPattern = () => {
  const { mutateAsync: addPattern } = useAdminAddPattern()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Add Pattern</h1>
        <h4>Add a pattern to the Frog Log catalog.</h4>
      </div>

      <PatternForm
        includeUsername
        onSubmit={addPattern}
        successRedirectPath="/admin/patterns"
      />
    </div>
  )
}
