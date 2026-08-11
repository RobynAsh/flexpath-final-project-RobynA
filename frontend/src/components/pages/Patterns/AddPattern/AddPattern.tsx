import { useAddPattern } from '../../../../services/useAddPattern'
import { PatternForm } from '../PatternForm'

export const AddPattern = () => {
  const { mutateAsync: addPattern } = useAddPattern()

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5 md:self-center">
      <div>
        <h1>Add Pattern</h1>
        <h4>Add a pattern to your Frog Log.</h4>
      </div>

      <PatternForm
        includeUsername={false}
        onSubmit={addPattern}
        successRedirectPath="/patterns"
      />
    </div>
  )
}
